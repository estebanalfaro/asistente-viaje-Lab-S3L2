import { store } from '../../state/store.js';
import { SummaryView } from './SummaryView.js';
import { TripView } from './TripView.js';
import { BudgetView } from './BudgetView.js';
import { ExpenseView } from './ExpenseView.js';
import { ItineraryView } from './ItineraryView.js';

class AppShell {
  constructor() {
    this.tabs = [
      { id: 'resumen', label: 'Resumen' },
      { id: 'mi-viaje', label: 'Mi viaje' },
      { id: 'presupuesto', label: 'Presupuesto' },
      { id: 'gastos', label: 'Gastos' },
      { id: 'itinerario', label: 'Itinerario' }
    ];
    this.activeTab = 'resumen';
    this.init();
  }

  init() {
    this.renderShell();
    this.bindEvents();
    store.subscribe(() => this.renderTabContent());
  }

  renderShell() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="app-header">
        <h1>Asistente de Viaje Personal</h1>
      </header>
      <nav class="tab-nav" id="tabNav">
        ${this.tabs.map(t => `<button class="tab-btn ${t.id === this.activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}
      </nav>
      <div id="toastContainer" class="toast-container"></div>
      <main class="main-content" id="mainContent"></main>
    `;
    this.renderTabContent();
  }

  bindEvents() {
    document.getElementById('tabNav').addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn) this.setActiveTab(btn.dataset.tab);
    });
  }

  setActiveTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    this.renderTabContent();
  }

  mostrarToast(mensaje, tipo = 'error') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  renderTabContent() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `<div id="viewContainer"></div>`;
    switch (this.activeTab) {
      case 'resumen': new SummaryView('viewContainer').render(); break;
      case 'mi-viaje': new TripView('viewContainer').render(); break;
      case 'presupuesto': new BudgetView('viewContainer').render(); break;
      case 'gastos': new ExpenseView('viewContainer').render(); break;
      case 'itinerario': new ItineraryView('viewContainer').render(); break;
      default: content.innerHTML = `<p>Vista no encontrada.</p>`;
    }
  }
}

export const appShell = new AppShell();