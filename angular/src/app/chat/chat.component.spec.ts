import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { GoChatComponent } from './go-chat.component';
import { ChatComponent } from './chat.component';

const ChatCompo: any = environment.go ? GoChatComponent : ChatComponent;

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatCompo],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCompo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
