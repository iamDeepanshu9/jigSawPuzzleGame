import {Component, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

  stepCount: number = 0;
  startTime: number = new Date().getTime();
  // gridSize: number = 4;
  timerFunction: any;
  images = [
    { src: 'assets/images/london-bridge.jpg', title: 'London Bridge' },
    { src: 'assets/images/lotus-temple.jpg', title: 'Lotus Temple' },
    { src: 'assets/images/qutub-minar.jpg', title: 'Qutub Minar' },
    { src: 'assets/images/statue-of-liberty.jpg', title: 'Statue Of Liberty' },
    { src: 'assets/images/taj-mahal.jpg', title: 'Taj Mahal' }
  ];

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // Define your images array here
    const gridQuery = document.querySelector('#levelPanel input[type="radio"]:checked') as HTMLElement;
    const gridSize = gridQuery.getAttribute('value') ?? 4;

    this.startGame(this.images,+gridSize);
  }

  startGame(images: any[], gridSize: number): void {
    this.setImage(images, gridSize);
    const playPanel =  document.getElementById('playPanel') as HTMLElement;
    playPanel.style.display = 'block';
    this.shuffle('sortable');
    this.stepCount = 0;
    this.startTime = new Date().getTime();
    this.tick();
  }

  tick(): void {
    const now = new Date().getTime();
    const elapsedTime = (now - this.startTime) / 1000;
    this.renderer.setProperty(document.getElementById('timerPanel'), 'textContent', elapsedTime);
    this.timerFunction = setTimeout(() => this.tick(), 1000);
  }

  setImage(images: any[], gridSize: number = 4): void {
    const percentage = 100 / (gridSize - 1);
    const image = images[Math.floor(Math.random() * images.length)];
    this.renderer.setProperty(document.getElementById('imgTitle'), 'innerHTML', image.title);
    this.renderer.setAttribute(document.getElementById('actualImage'), 'src', image.src);
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

  dragStart(event: DragEvent): void {
    const id: string = (event.target as HTMLElement).getAttribute('id') ?? '';
    event.dataTransfer?.setData('data', id);
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    const origin = document.getElementById(event.dataTransfer?.getData('data') as string);
    const dest = event.target as HTMLElement;
    const p = dest.parentNode;

    if (origin && dest && p) {
      const temp = dest.nextSibling as Node;
      const x_diff = origin.offsetLeft - dest.offsetLeft;
      const y_diff = origin.offsetTop - dest.offsetTop;

      if (y_diff == 0 && x_diff > 0) {
        // LEFT SWAP
        p.insertBefore(origin, dest);
        p.insertBefore(temp, origin);
      } else {
        p.insertBefore(dest, origin);
        p.insertBefore(origin, temp);
      }
      const sortableElement = document.getElementById('sortable') as HTMLElement;
      const valIds = Array.from(sortableElement?.children).map(x => +x['id']);
      const now = new Date().getTime();
      this.stepCount++;
      this.renderer.setProperty(document.getElementById('stepCount'), 'textContent', this.stepCount);
      this.renderer.setProperty(document.querySelector('.timeCount'), 'textContent', (now - this.startTime) / 1000);

      if (this.isSorted(valIds)) {
        // Game Over
        // this.renderer.setStyle(document.getElementById('actualImageBox'), 'display', 'none');
        // this.renderer.setStyle(document.getElementById('gameOver'), 'display', 'block');
        const gameOverElement = document.getElementById('gameOver') as HTMLElement;
        this.renderer.setProperty(document.getElementById('actualImageBox'), 'innerHTML', gameOverElement.innerHTML);
        this.renderer.setProperty(document.getElementById('stepCount'), 'textContent', this.stepCount.toString());
      }
    }
  }

  shuffle(id: string): void {
    const ul = document.getElementById(id);
    if (!ul) return;
    for (let i = ul.children.length; i >= 0; i--) {
      ul.appendChild(ul.children[Math.random() * i | 0]);
    }
  }

  isSorted(arr: number[]): boolean {
    return arr.every((elem, index) => elem == index);
  }
  restart() {
    const gridElement = document.querySelector('#levelPanel input[type="radio"]:checked') as HTMLElement;
    const gridSize = gridElement.getAttribute('value') ?? 4;
    this.startGame(this.images, +gridSize);
  }
  rules() {
    alert('Re arrange the image parts in a way that it correctly forms the picture. \nThe no. of steps taken will be counted.');
  }
  about() {
    alert('Developed by Deepanshu.');
  }

}
