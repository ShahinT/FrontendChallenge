import { ICountDown, ITimeRemaining } from "../interfaces/Time";
import { Injectable } from "@angular/core";
import { BehaviorSubject, interval, map, Subscription, takeWhile } from "rxjs";

@Injectable({ providedIn: "root" })
export class CountdownService {
  private COUNT_DOWN_KEY: string = "countDown";
  private sub!: Subscription;

  countDown$ = new BehaviorSubject<ICountDown | null>(null);
  remainingTime$ = new BehaviorSubject<ITimeRemaining>({
    seconds: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  });

  setCountdown({ countDown }: { countDown: ICountDown }): void {
    localStorage.setItem(this.COUNT_DOWN_KEY, JSON.stringify(countDown));
    this.countDown$.next(countDown);
  }

  /** Calculate remaining time */
  private calculateTime(distance: number): ITimeRemaining {
    const seconds: number = Math.floor((distance / 1000) % 60);
    const minutes: number = Math.floor((distance / (1000 * 60)) % 60);
    const hours: number = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  }

  getDistance(): number {
    const countDown: ICountDown | null = this.countDown$.value;
    return countDown ? new Date(countDown.endDate).getTime() - Date.now() : 0;
  }

  startCountdown(): void {
    const countDown: ICountDown | null = this.countDown$.value;
    if (!countDown || !countDown.endDate) {
      console.error("Countdown data is missing or invalid.");
      return;
    }
    this.sub = interval(1000).subscribe(() => {
      if (this.getDistance() > 0) {
        this.remainingTime$.next(this.calculateTime(this.getDistance()));
      } else {
        this.sub.unsubscribe();
        this.remainingTime$.next({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    });
  }

  fetchCounter() {
    const storedCountDown: string | null = localStorage.getItem(
      this.COUNT_DOWN_KEY,
    );
    this.countDown$.next(storedCountDown ? JSON.parse(storedCountDown) : null);
  }

  clearCountdown(): void {
    localStorage.removeItem(this.COUNT_DOWN_KEY);
    this.countDown$.next(null);
  }
}
