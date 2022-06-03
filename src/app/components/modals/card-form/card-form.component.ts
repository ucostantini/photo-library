import { Component, Inject, OnInit } from '@angular/core';
import { Card } from '../../../core/models/card';
import { CardService } from '../../../core/services/card/card.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileService } from '../../../core/services/file/file.service';
import { FilePreviewModel } from 'ngx-awesome-uploader';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

  form: FormGroup;
  status: string;
  private files: number[] = [];

  constructor(private cardService: CardService, public fileService: FileService, private dialogRef: MatDialogRef<CardFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { card: Card, isSearch: boolean }) {
  }

  ngOnInit(): void {
    const inCard = this.data.card;
    const isSearch = this.data.isSearch;
    this.status = isSearch ? 'Search' : (inCard ? 'Edit' : 'Create');

    this.form = new FormGroup({
      title: new FormControl(inCard ? inCard.title : '', !isSearch ? [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)] : []
      ),
      files: new FormControl(inCard ? inCard.files : this.files, !isSearch ? Validators.minLength(1) : []),
      tags: new FormControl(inCard ? inCard.tags : '', !isSearch ? Validators.required : []),
      source: new FormGroup({
        website: new FormControl(inCard ? inCard.source.website : '', !isSearch ? [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)] : []
        ),
        username: new FormControl(inCard ? inCard.source.username : '', !isSearch ? [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)] : []
        )
      })
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    let card: Card = null;
    if (!(this.data.isSearch && this.form.getRawValue() == {})) {
      const formData = (this.form.getRawValue() as Card);
      card = this.data.card ? {...formData, cardId: this.data.card.cardId} : formData;
    }

    this.dialogRef.close(card);
  }

  onFileUploaded($event: FilePreviewModel): void {
    this.files.push($event.uploadResponse.fileId);
  }

  onFileRemoved($event: FilePreviewModel): void {
    this.files = this.files.filter((fileId: number) => fileId !== $event.uploadResponse.fileId);
  }
}