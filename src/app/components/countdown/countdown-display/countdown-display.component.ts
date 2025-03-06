import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountdownService } from "../../../services/countdown.service";
import { IBox, ICountDown, ITimeRemaining } from "../../../interfaces/Time";
import { Observable, Subscription } from "rxjs";
import { FitTextDirective } from "../../../directive/fit-text.directive";
import { COUNT_DOWN_BOXES } from "../../../data";

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
  countDown$: Observable<ICountDown | null>;

  constructor() {
    this.countDown$ = this.countdownService.countDown$;
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
