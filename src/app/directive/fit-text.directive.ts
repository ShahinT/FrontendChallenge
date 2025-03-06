import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  HostListener,
  Input,
} from "@angular/core";

@Directive({
  selector: "[appFitText]",
  standalone: true,
})
export class FitTextDirective implements AfterViewInit, OnDestroy {
  @Input() group: string = "";
  private static groups: { [key: string]: FitTextDirective[] } = {};
  private readonly minFontSize = 10;
  private readonly maxFontSize = 200;
  private localFontSize: number = this.minFontSize;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.style.whiteSpace = "nowrap";
    if (this.group) {
      if (!FitTextDirective.groups[this.group]) {
        FitTextDirective.groups[this.group] = [];
      }
      FitTextDirective.groups[this.group].push(this);
    }
    this.fitText();
  }

  ngOnDestroy() {
    if (this.group && FitTextDirective.groups[this.group]) {
      FitTextDirective.groups[this.group] = FitTextDirective.groups[
        this.group
      ].filter((inst) => inst !== this);
      this.updateGroupFontSize();
    }
  }

  @HostListener("window:resize")
  onResize() {
    this.fitText();
  }

  private fitText() {
    const parent = this.el.nativeElement.parentElement;
    if (!parent) return;
    const availableWidth = parent.clientWidth;
    let fontSize = this.minFontSize;
    this.el.nativeElement.style.fontSize = fontSize + "px";
    while (
      fontSize < this.maxFontSize &&
      this.el.nativeElement.scrollWidth < availableWidth
    ) {
      fontSize++;
      this.el.nativeElement.style.fontSize = fontSize + "px";
    }
    if (this.el.nativeElement.scrollWidth > availableWidth) {
      fontSize--;
      this.el.nativeElement.style.fontSize = fontSize + "px";
    }
    this.localFontSize = fontSize;
    if (this.group) {
      this.updateGroupFontSize();
    }
  }

  private updateGroupFontSize() {
    if (!this.group) return;
    const instances = FitTextDirective.groups[this.group];
    if (!instances || !instances.length) return;
    const globalMin = Math.min(...instances.map((inst) => inst.localFontSize));
    instances.forEach((inst) => {
      inst.el.nativeElement.style.fontSize = globalMin + "px";
    });
  }
}
