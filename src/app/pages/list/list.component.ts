import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TextField } from 'tns-core-modules/ui/text-field';

import * as SocialShare from 'nativescript-social-share';

import { Grocery } from './../../shared/grocery/grocery';
import { GroceryListService } from './../../shared/grocery/grocery-list.service';
import { Color } from 'tns-core-modules/color/color';
import { setHintColor } from './../../utils/hint-util';

@Component({
  selector: 'list',
  providers: [GroceryListService],
  templateUrl: './list.component.html',
  styleUrls: ['./list-common.css', './list.css']
})
export class ListComponent implements OnInit {
  public groceryList: Grocery[] = [];
  public grocery = '';
  public isLoading = false;
  public listLoaded = false;
  @ViewChild('groceryText') groceryName: ElementRef;

  constructor(private groceryService: GroceryListService) {}

  ngOnInit() {
    
    this.isLoading = true;
    this.groceryService.load().subscribe(data => {
      data.forEach(
        (grocery: Grocery): void => {
          this.groceryList.unshift(grocery);
        }
      );
      this.isLoading = false;
      this.listLoaded = true;
      this.setTextFieldColors();
    });
  }

  public add() {
    // console.log('Grocery: ', this.grocery);
    if (this.grocery.trim() == '') {
      alert('Enter a grocery item');
      return;
    }
    // Dismiss the keyboard
    let textField = <TextField>this.groceryName.nativeElement;
    textField.dismissSoftInput();

    this.groceryService.add(this.grocery).subscribe(g => {
      // console.log('return: ', g);
      this.groceryList.unshift(g);
      this.grocery = '';
    }),
      err => {
        alert({
          message: 'Could not add your grocery item to the list',
          OkButtonText: 'OK'
        });
        this.grocery = '';
      };
  }

  public delete(item: Grocery) {
    this.groceryService.delete(item).subscribe(
      () => this.deleteItemFromGroceryList(item),
      err =>
        alert({
          message: 'Could not delete the grocery',
          OkButtonText: 'OK'
        })
    );
  }

  private deleteItemFromGroceryList(item: Grocery): void {
    const index: number = this.groceryList.indexOf(item);
    if (index !== -1) {
      this.groceryList.splice(index, 1);
    }
  }

  public share() {
    const list = [];
    for (let i = 0, size = this.groceryList.length; i < size; i++) {
      list.push(this.groceryList[i].name);
    }
    const listText = list.join(', ').trim();
    SocialShare.shareText(listText);
  }

  private setTextFieldColors() {
    const groceryTextField = <TextField>this.groceryName.nativeElement;

    const mainTextFieldColor = new Color('#C4AFB4');
    groceryTextField.color = mainTextFieldColor;

    const hintColor = new Color('#C4AFB4');
    setHintColor({ view: groceryTextField, color: hintColor });
  }
}
