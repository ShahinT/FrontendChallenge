/**
 * This directive automatically adjusts text size to fit within its parent container.
 * If multiple elements share the same group name, they will all use the smallest calculated font size.
 */

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

  /**
   * Initializes the directive by preventing text wrapping and adjusting font size.
   * If part of a group, it registers the instance and synchronizes font sizes.
   */
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

  /**
   * Cleans up the instance when destroyed by removing it from the group
   * and updating font sizes for the remaining elements.
   */
  ngOnDestroy() {
    if (this.group && FitTextDirective.groups[this.group]) {
      FitTextDirective.groups[this.group] = FitTextDirective.groups[
        this.group
      ].filter((inst) => inst !== this);
      this.updateGroupFontSize();
    }
  }

  /**
   * Recalculates text size when the window resizes to keep it fitting properly.
   */
  @HostListener("window:resize")
  onResize() {
    this.fitText();
  }

  /**
   * Adjusts the font size dynamically so the text fits within its parent container.
   * It increases the font size until it reaches the maximum limit or exceeds the available width.
   * If it overflows, it decreases the size by one step.
   */
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

  /**
   * Ensures all elements in the same group use the smallest font size
   * among them to maintain visual consistency.
   */
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
