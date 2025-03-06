import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CountdownService } from "./services/countdown.service";
import { CountdownComponent } from "./components/countdown/countdown.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, CountdownComponent],
  templateUrl: "./app.component.html",
  styleUrl: "app.component.scss",
  providers: [CountdownService],
})
export class AppComponent implements OnInit {
  private countdownService = inject(CountdownService);

  /** Acting like it is a fetch call from a database **/
  ngOnInit() {
    this.countdownService.fetchCounter();
  }
}
