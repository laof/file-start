import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoChatComponent } from './chat/go-chat.component';
import { ChatComponent } from './chat/chat.component';
import { FilesComponent } from './files/files.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'files',
    pathMatch: 'full',
  },
  {
    path: 'files',
    component: FilesComponent,
  },
  {
    path: 'chat',
    component: environment.go ? GoChatComponent : ChatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
