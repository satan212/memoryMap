import { Routes } from '@angular/router';
import { MemoriesListPage} from './pages/memories-list/memories-list';
import { MapPage } from './pages/map/map';
import { MemoryEntryPage } from './pages/memory-entry/memory-entry';
import { Home } from './pages/home/home';
import { MemoryViewPage } from './pages/memory-view/memory-view';

export const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' }, // default route
  { path: 'map', component: MapPage },
  { path: 'home', component: Home },
  { path: 'memories', component: MemoriesListPage }, // Fixed route name to match navigation calls
  { path: 'add-memory', component: MemoryEntryPage }, // Fixed route name to match navigation calls
  { path: 'view-memory/:id', component: MemoryViewPage }, // Fixed route to include parameter
  { path: '**', redirectTo: '/map' } // Wildcard route for handling unknown paths
];