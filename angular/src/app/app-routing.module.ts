import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FilesComponent } from './files/files.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'files',
    pathMatch: 'full'
  },
  {
    path: 'files',
    component: FilesComponent
  }, {
    path: 'chat',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
