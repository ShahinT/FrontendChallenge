import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CountdownService } from "@/services/countdown.service";
import { CommonModule } from "@angular/common";
import { ICountDown } from "@/interfaces/Time";

@Component({
  selector: "app-countdown-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./countdown-form.component.html",
  styleUrls: ["./countdown-form.component.scss"],
})
export class CountdownFormComponent {
  countDown: ICountDown = {
    eventName: "",
    endDate: "",
  };

  countdownService = inject(CountdownService);
  errorMessage: string = "";

  onSubmit(): void {
    this.errorMessage = "";

    if (!this.isValidEventName(this.countDown.eventName)) {
      this.errorMessage = "Event name must be at least 3 characters.";
      return;
    }

    if (!this.isValidEndDate(this.countDown.endDate)) {
      this.errorMessage = "End date must be a valid future date.";
      return;
    }

    this.countdownService.setCountdown({ countDown: this.countDown });
  }

  isValidEventName(eventName: string): boolean {
    return eventName.trim().length >= 3;
  }

  isValidEndDate(endDate: string): boolean {
    const eventDate = new Date(endDate);
    return !isNaN(eventDate.getTime()) && eventDate > new Date();
  }
}
