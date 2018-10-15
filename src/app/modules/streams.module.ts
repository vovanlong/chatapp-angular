import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StreamsComponent, ToolbarComponent, SideComponent],
  exports: [StreamsComponent],
  providers: [TokenService]
})
export class StreamsModule {}
