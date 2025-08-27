import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemoryService, Memory } from '../../services/memory.service';

@Component({
  selector: 'app-memories-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './memories-list.html',
  styleUrls: ['./memories-list.css']
})
export class MemoriesListPage implements OnInit {
  allMemories: Memory[] = [];
  filteredMemories: Memory[] = [];
  availableTags: string[] = [];
  searchTerm: string = '';
  selectedTag: string = '';
  lat?: number;
  lng?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memoryService: MemoryService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.lat = params['lat'] ? +params['lat'] : undefined;
      this.lng = params['lng'] ? +params['lng'] : undefined;
      this.loadMemories();
    });
  }

  loadMemories() {
    if (this.lat !== undefined && this.lng !== undefined) {
      this.allMemories = this.memoryService.getMemoryByLocation(this.lat, this.lng);
    } else {
      this.allMemories = this.memoryService.getMemories();
    }
    
    this.filteredMemories = [...this.allMemories];
    this.loadAvailableTags();
  }

  loadAvailableTags() {
    const allTags = this.allMemories.flatMap(memory => memory.tags);
    this.availableTags = [...new Set(allTags)].sort();
  }

  filterMemories() {
    this.filteredMemories = this.allMemories.filter(memory => {
      const matchesSearch = !this.searchTerm || 
        memory.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        memory.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        memory.uploadedBy.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesTag = !this.selectedTag || 
        memory.tags.includes(this.selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedTag = '';
    this.filteredMemories = [...this.allMemories];
  }

  getMemoryPreview(description: string): string {
    return description.length > 120 ? description.substring(0, 120) + '...' : description;
  }

  viewMemory(memoryId: string) {
    this.router.navigate(['/view-memory', memoryId]);
  }

  addNewMemory() {
    if (this.lat !== undefined && this.lng !== undefined) {
      this.router.navigate(['/add-memory'], {
        queryParams: { lat: this.lat, lng: this.lng }
      });
    } else {
      this.router.navigate(['/map']);
    }
  }

  goBackToMap() {
    this.router.navigate(['/map']);
  }

  trackByMemoryId(index: number, memory: Memory): string {
    return memory.id;
  }
}