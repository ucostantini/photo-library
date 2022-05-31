import { Component } from '@angular/core';
import { CardFormComponent } from '../modals/card-form/card-form.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CardService } from '../../core/services/card/card.service';
import { Card, Paginate, Sorting } from '../../core/models/card';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  form: FormGroup;

  constructor(public dialog: MatDialog, private cardService: CardService) {
    this.form = new FormGroup({
      sort: new FormControl('cardId'),
      order: new FormControl('asc'),
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(CardFormComponent, {
      data: {card: null, isSearch: false},
    });
    // TODO handle service response for add,search,delete (toaster ?)
    dialogRef.afterClosed().subscribe((card: Card) =>
      this.cardService.create(card).subscribe(val => console.log(val))
    );
  }

  onSearch() {
    const dialogRef = this.dialog.open(CardFormComponent, {
      data: {card: null, isSearch: true},
    });

    dialogRef.afterClosed().subscribe((card: Card) => {
      this.cardService.fetchCount(0, card).pipe(
        mergeMap((count: Paginate) => this.cardService.fetch(count, (this.form.getRawValue() as Sorting), card))
      )
        .subscribe(val => console.log(val));
    });
  }

  onSortSubmit() {
    this.cardService.getSortingEmitter().emit(this.form.getRawValue() as Sorting);
  }
}
