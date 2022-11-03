import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function getDateOffset(offset: number): Date {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + offset);
  newDate.setUTCHours(0);
  newDate.setUTCMinutes(0);
  newDate.setUTCSeconds(0);
  newDate.setUTCMilliseconds(0);
  return newDate;
}

export function getDateString(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }
  const newDueDate = new Date(date);
  return `${newDueDate.getFullYear()}-${addZeroToDate((newDueDate.getMonth() + 1).toString())}-${addZeroToDate(newDueDate.getDate().toString())}`;
}

function addZeroToDate(date: string): string {
  return (('0' + date) as string).slice(-2);
}

export function click<T>(
  fixture: ComponentFixture<T>,
  testId: string
): void {
  const element = findEl(fixture, testId);
  const event = makeClickEvent(element.nativeElement);
  element.triggerEventHandler('click', event);
}

export function makeClickEvent(
  target: EventTarget
): Partial<MouseEvent> {
  return {
    type: 'click',
    target,
    currentTarget: target,
    bubbles: true,
    cancelable: true,
    button: 0
  };
}

export function findEl<T>(
  fixture: ComponentFixture<T>,
  testId: string
): DebugElement {
  return fixture.debugElement.query(
    By.css(`[data-test-id="${testId}"]`)
  );
}
