import { Component, inject, OnInit } from "@angular/core";
import { CountdownService } from "../../services/countdown.service";
import { CountdownFormComponent } from "./countdown-form/countdown-form.component";
import { CountdownDisplayComponent } from "./countdown-display/countdown-display.component";
import { ICountDown } from "../../interfaces/Time";

@Component({
  selector: "app-countdown",
  standalone: true,
  imports: [CountdownFormComponent, CountdownDisplayComponent],
  templateUrl: "./countdown.component.html",
  styleUrl: "./countdown.component.scss",
})
export class CountdownComponent implements OnInit {
  countdownService = inject(CountdownService);
  countDown: ICountDown | null = null;

  ngOnInit(): void {
    this.countdownService.countDown$.subscribe((value: ICountDown | null) => {
      this.countDown = value;
    });
  }
}
