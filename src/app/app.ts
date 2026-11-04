/*
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Home } from './home/home';
import { Transport } from './transport/transport';
import { Routes } from './routes/routes';


@Component({
  selector: 'app-root',
  imports: [NgOptimizedImage, RouterOutlet, Home, Routes, Transport],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Basi School Transportation Management');
}
*/


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}