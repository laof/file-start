// import { HttpClient } from '@angular/common/http';
// import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { HttpLocalhost, HttpUrl } from '../shared/http/http-url';
// import { SocketIDService } from '../shared/service/storage.service';

// interface Message {
//   author: string;
//   text: string;
//   time?: number
//   type?: string;
// }

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.less']
// })
// export class ChatComponent implements OnInit, OnDestroy {

//   @ViewChild('listRef', { static: false }) listRef: ElementRef | undefined;

//   myId: string = '';
//   list: Message[] = [];
//   text: string = '';

//   private websocket: WebSocket

//   private sendSocket(data: object) {
//     this.websocket.send(JSON.stringify(data));
//   }

//   constructor(private http: HttpClient, private storage: SocketIDService) {


//     const id = this.storage.getItem();
//     if (!id) {
//       this.storage.setItem(new Date().getTime().toString())
//     }

//     this.myId = this.storage.getItem();

//     const ws = "ws://" + location.host + "/api/chat";

//     const websocket = new WebSocket(ws);

//     this.websocket = websocket

//     websocket.onopen = (evt) => {
//       const data = {
//         type: "sign",
//         data: String(this.myId),
//       };

//       this.sendSocket(data)
//     };
//     websocket.onclose = function (evt) {
//       console.log("onclose", evt);
//     };

//     websocket.onmessage = (evt) => {
//       let res: any = {};
//       try {
//         res = JSON.parse(evt.data);
//       } catch (e) { }

//       res.data && this.list.push(res.data);
//       this.scrollTop();
//     };


//     // socket.on('chat message', (data: Message) => {
//     //   this.list.push(data);
//     //   this.scrollTop();
//     // });

//     // this.socket = socket;

//     this.http.post(HttpUrl.talkHistory, null).subscribe((res: any) => {
//       const list: Message[] = res.list || [];
//       this.list = list.concat(this.list);
//       this.scrollTop();
//     })
//   }


//   scrollTop() {
//     setTimeout(() => {
//       const ele = this.listRef?.nativeElement;
//       if (ele) {
//         ele.scrollTop = ele.scrollHeight;
//       }
//     }, 100)
//   }

//   send() {
//     if (this.text && this.text != '\n') {

//       const data = {
//         type: 'chat',
//         data: this.text
//       }

//       this.sendSocket(data);
//     }
//     this.clear();
//   }

//   clear() {
//     setTimeout(() => {
//       this.text = '';
//     }, 0);
//   }

//   ngOnInit(): void {
//   }

//   ngOnDestroy(): void {
//     try {
//       this.websocket.close();
//     } catch (e) {
//       console.log('socket ngOnDestroy error');
//     }
//   }

// }
