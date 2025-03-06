/**
 * This component displays a countdown timer.
 * It subscribes to a eventName from countdown
 * and updates the remaining time dynamically.
 */

import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountdownService } from "@/services/countdown.service";

import { IBox, ITimeRemaining } from "@/interfaces/Time";
import { Observable, Subscription } from "rxjs";
import { FitTextDirective } from "@/directive/fit-text.directive";
import { COUNT_DOWN_BOXES } from "@/data";

@Component({
  selector: "app-countdown-display",
  standalone: true,
  imports: [CommonModule, FitTextDirective],
  styleUrls: ["./countdown-display.component.scss"],
  templateUrl: "./countdown-display.component.html",
})
export class CountdownDisplayComponent implements OnDestroy {
  private remainingTimeSubscription!: Subscription;
  countdownService = inject(CountdownService);
  remainingTime!: ITimeRemaining;
  isPassed: boolean = false;
  protected readonly boxes: IBox[] = COUNT_DOWN_BOXES;
  eventName$: Observable<string | null>;

  /**
   * Initializes the component by subscribing to the eventName.
   * Starts the countdown if it's still running; otherwise, marks it as passed.
   */
  constructor() {
    this.eventName$ = this.countdownService.eventName$;
    this.remainingTimeSubscription =
      this.countdownService.remainingTime$.subscribe((time: ITimeRemaining) => {
        this.remainingTime = time;
        if (this.countdownService.getDistance() <= 0) {
          this.isPassed = true;
        }
      });

    if (this.countdownService.getDistance() >= 0) {
      this.countdownService.startCountdown();
    } else {
      this.isPassed = true;
    }
  }

  get isLoading(): boolean {
    return (
      this.remainingTime.days === 0 &&
      this.remainingTime.hours === 0 &&
      this.remainingTime.minutes === 0 &&
      this.remainingTime.seconds === 0
    );
  }

  ngOnDestroy(): void {
    this.remainingTimeSubscription.unsubscribe();
  }

  clearCountdown(): void {
    this.countdownService.clearCountdown();
  }
}
