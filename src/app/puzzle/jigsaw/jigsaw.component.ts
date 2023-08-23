import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ApiHandleService} from "../../services/api-handle.service";
import {SnackBarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-jigsaw',
  templateUrl: './jigsaw.component.html',
  styleUrls: ['./jigsaw.component.css']
})
export class JigsawComponent implements OnInit {
  @ViewChild('sortable') private sortable: ElementRef;
  public stepCount$$ = new BehaviorSubject<any>(null);
  public timeCount$$ = new BehaviorSubject<any>(null);

  public startTime$$ = new BehaviorSubject<any>(null)
  public timerFunction: any;
  public isGameStarted$$ = new BehaviorSubject<boolean>(false);
  public isGameOver$$ = new BehaviorSubject(false);


  public images = [
    {src: 'assets/images/londonBridge.jpg', title: 'London Bridge'},
    {src: 'assets/images/qutubMinar.jpg', title: 'Qutub Minar'},
    {src: 'assets/images/statue-of-liberty.jpg', title: 'Statue Of Liberty'},
    {src: 'assets/images/tajMahal.jpg', title: 'Taj Mahal'}
  ];
  public selectedImage$$ = new BehaviorSubject(this.images[Math.floor(Math.random() * this.images.length)]);

  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router, private apiHandleService: ApiHandleService, private sbs: SnackBarService) {
  }

  public ngOnInit(): void {
  }

  public handleUnscramble() {
    //startGame
    this.isGameStarted$$.next(true);
    this.startGame(this.selectedImage$$.value,4);
  }

  public handleScramble() {
    //endGame
    console.log('scramble')
    this.router.navigate(['user'],{
      state: {time: this.timeCount$$.value, steps: this.stepCount$$}
    })
    const requestBody = {
      userId: localStorage.getItem('userId'),
      steps: this.stepCount$$.value,
      timeTaken: this.timeCount$$.value,
      playingDate: (new Date()).toString(),
      puzzleImage: this.selectedImage$$.value.title,
    }

    this.apiHandleService.scramble$(requestBody).pipe().subscribe((res) =>{
      if(res){
        this.sbs.showMessage('Saved Successfully')
        this.router.navigate(['user'],{
          state : {
            userDetails: res
          }
        })
      }
    },(err)=>{
      this.sbs.showError();
    })
  }

  public startGame(image: any, gridSize: number){
    this.setImage(image, gridSize);
    const playPanel =  document.getElementById('playPanel') as HTMLElement;
    playPanel.style.display = 'block';
    this.shuffle('sortable');
    this.stepCount$$.next(0);
    this.startTime$$.next( new Date().getTime());
    this.tick();
  }

  public setImage(image: any, gridSize: number){
    const percentage = 100 / (gridSize - 1);
    // const imgTitleElement = document.getElementById('imgTitle');
    // imgTitleElement.innerHTML = image.title;

    // const actualImageElement = document.getElementById('actualImage') as HTMLImageElement;
    // actualImageElement.src = image.src;

    // this.renderer.setProperty(document.getElementById('imgTitle'), 'innerHTML', image.title);
    // this.renderer.setAttribute(document.getElementById('actualImage'), 'src', image.src);
    this.renderer.setProperty(document.getElementById('sortable'), 'innerHTML', '');


    for (let i = 0; i < gridSize * gridSize; i++) {
      const xpos = `${percentage * (i % gridSize)}%`;
      const ypos = `${percentage * Math.floor(i / gridSize)}%`;

      const li = this.renderer.createElement('li');
      this.renderer.setAttribute(li, 'id', i.toString());
      this.renderer.setAttribute(li, 'data-value', i.toString());
      this.renderer.setStyle(li, 'background-image', `url(${image.src})`);
      this.renderer.setStyle(li, 'background-size', `${gridSize * 100}%`);
      this.renderer.setStyle(li, 'background-position', `${xpos} ${ypos}`);
      this.renderer.setStyle(li, 'width', `${400 / gridSize}px`);
      this.renderer.setStyle(li, 'height', `${400 / gridSize}px`);
      this.renderer.setAttribute(li, 'draggable', 'true');

      this.renderer.listen(li, 'dragstart', (event) => this.dragStart(event));
      this.renderer.listen(li, 'dragover', (event) => event.preventDefault());
      this.renderer.listen(li, 'drop', (event) => this.drop(event));

      this.renderer.appendChild(document.getElementById('sortable'), li);
    }

    this.shuffle('sortable');
  }

  public shuffle(id: string){
    const ul = document.getElementById(id) as HTMLElement;
    if (!ul) return;
    for (let i = ul.children.length; i >= 0; i--) {
      ul.appendChild(ul.children[Math.random() * i | 0]);
    }
  }

  public isSorted(arr: number[]): boolean{
    return arr.every((elem, index) => elem == index);
  }

  public dragStart(event: DragEvent): void {
    const id: string = (event.target as HTMLElement).getAttribute('id') ?? '';
    event.dataTransfer?.setData('data', id);
  }

  public drop(event: DragEvent): void {
    event.preventDefault();
    const origin = document.getElementById(event.dataTransfer?.getData('data') as string);
    const dest = event.target as HTMLElement;
    const p = dest.parentNode;

    if (origin && dest && p) {
      const temp = dest.nextSibling as Node;
      const x_diff = origin.offsetLeft - dest.offsetLeft;
      const y_diff = origin.offsetTop - dest.offsetTop;

      // Use Renderer2 to manipulate the DOM instead of direct DOM access
      if (y_diff === 0 && x_diff > 0) {
        // LEFT SWAP
        this.renderer.insertBefore(p, origin, dest);
        this.renderer.insertBefore(p, temp, origin);
      } else {
        this.renderer.insertBefore(p, dest, origin);
        this.renderer.insertBefore(p, origin, temp);
      }

      const sortableElement = document.getElementById('sortable') as HTMLElement;
      const valIds = Array.from(sortableElement?.children).map((x) => +x['id']);
      const now = new Date().getTime();
      this.stepCount$$.next(this.stepCount$$.value + 1);
      // this.renderer.setProperty(document.getElementById('stepCount'), 'textContent', this.stepCount$$);
      this.timeCount$$.next((now - this.startTime$$.value) / 1000);

      if (this.isSorted(valIds)) {
       this.isGameOver$$.next(true);
       console.log(this.stepCount$$.value);
       console.log(this.timeCount$$.value)
      }
    }
  }

  public tick(): void {
    const now = new Date().getTime();
    const elapsedTime = (now - this.startTime$$.value) / 1000;
    // this.renderer.setProperty(document.getElementById('timerPanel'), 'textContent', elapsedTime);
    this.timerFunction = setTimeout(() => this.tick(), 1000);
  }

  public logOut() {
    this.authService.logout();
    this.router.navigate(['/auth', 'login']);
  }

  public userDetail() {
    this.router.navigate(['user'])
  }

  public restart() {
    this.isGameStarted$$.next(false);
    this.isGameOver$$.next(false);
    this.selectedImage$$.next(this.images[Math.floor(Math.random() * this.images.length)]);
  }
}
