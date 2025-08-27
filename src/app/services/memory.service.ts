import { Injectable } from '@angular/core';

export interface Memory {
  id: string;
  title: string;
  description: string;
  uploadedBy: string;
  tags: string[];
  lat: number;
  lng: number;
  createdAt: Date;
  fileName?: string;
  fileContent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  private readonly STORAGE_KEY = 'memories';

  constructor() {}

  saveMemory(memory: Omit<Memory, 'id' | 'createdAt'>): string {
    const memories = this.getMemories();
    const newMemory: Memory = {
      ...memory,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    memories.push(newMemory);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memories));
    return newMemory.id;
  }

  getMemories(): Memory[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).map((memory: any) => ({
          ...memory,
          createdAt: new Date(memory.createdAt)
        }));
      } catch (e) {
        console.error('Error parsing memories from localStorage', e);
        return [];
      }
    }
    return [];
  }

  getMemoryByLocation(lat: number, lng: number, tolerance: number = 0.001): Memory[] {
    const memories = this.getMemories();
    return memories.filter(memory => 
      Math.abs(memory.lat - lat) < tolerance && 
      Math.abs(memory.lng - lng) < tolerance
    );
  }

  // New method to check if a location has memories nearby
  hasMemoriesNearby(lat: number, lng: number, tolerance: number = 0.01): boolean {
    const memories = this.getMemoryByLocation(lat, lng, tolerance);
    return memories.length > 0;
  }

  // New method to get the closest memory to a location
  getClosestMemory(lat: number, lng: number): Memory | null {
    const memories = this.getMemories();
    if (memories.length === 0) return null;

    let closestMemory = memories[0];
    let minDistance = this.calculateDistance(lat, lng, closestMemory.lat, closestMemory.lng);

    for (let i = 1; i < memories.length; i++) {
      const distance = this.calculateDistance(lat, lng, memories[i].lat, memories[i].lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestMemory = memories[i];
      }
    }

    return closestMemory;
  }

  getMemoryById(id: string): Memory | null {
    const memories = this.getMemories();
    return memories.find(memory => memory.id === id) || null;
  }

  searchMemoriesByTag(tag: string): Memory[] {
    const memories = this.getMemories();
    return memories.filter(memory => 
      memory.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  getAllTags(): string[] {
    const memories = this.getMemories();
    const allTags = memories.flatMap(memory => memory.tags);
    return [...new Set(allTags)].sort();
  }

  // Helper method to calculate distance between two points
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}