import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemoryService, Memory } from '../../services/memory.service';

@Component({
  selector: 'app-memory-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory-view.html',
  styleUrls: ['./memory-view.css']
})
export class MemoryViewPage implements OnInit {
  memory: Memory | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memoryService: MemoryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const memoryId = params['id'];
      this.loadMemory(memoryId);
    });
  }

  loadMemory(id: string) {
    this.loading = true;
    setTimeout(() => {
      this.memory = this.memoryService.getMemoryById(id);
      this.loading = false;
    }, 500); // Simulate loading delay
  }

  goBackToMap() {
    this.router.navigate(['/map']);
  }

  viewOnMap() {
    if (this.memory) {
      this.router.navigate(['/map'], {
        queryParams: { 
          lat: this.memory.lat, 
          lng: this.memory.lng,
          zoom: 15
        }
      });
    }
  }

  searchByTag(tag: string) {
    this.router.navigate(['/map'], {
      queryParams: { search: tag }
    });
  }

  addAnotherMemory() {
    if (this.memory) {
      this.router.navigate(['/add-memory'], {
        queryParams: { 
          lat: this.memory.lat, 
          lng: this.memory.lng 
        }
      });
    }
  }

  viewAllMemories() {
    if (this.memory) {
      this.router.navigate(['/memories'], {
        queryParams: { 
          lat: this.memory.lat, 
          lng: this.memory.lng 
        }
      });
    }
  }
}