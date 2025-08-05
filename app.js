// Application Data
const appData = {
  visibility_data: [
    {"brand": "TechFlow Solutions", "visibility_rate": 43.0, "avg_position": 2.8, "improvement_potential": 31.0, "avg_sentiment": -0.03, "avg_accuracy": 0.82},
    {"brand": "DataVise Analytics", "visibility_rate": 44.0, "avg_position": 3.5, "improvement_potential": 39.7, "avg_sentiment": 0.07, "avg_accuracy": 0.84},
    {"brand": "CloudShift Pro", "visibility_rate": 45.0, "avg_position": 3.2, "improvement_potential": 22.4, "avg_sentiment": -0.02, "avg_accuracy": 0.81},
    {"brand": "AI Insights Corp", "visibility_rate": 43.0, "avg_position": 3.1, "improvement_potential": 25.4, "avg_sentiment": -0.05, "avg_accuracy": 0.79},
    {"brand": "DigitalEdge Systems", "visibility_rate": 47.0, "avg_position": 3.0, "improvement_potential": 23.3, "avg_sentiment": -0.09, "avg_accuracy": 0.83}
  ],
  competitive_data: [
    {"brand": "TechFlow Solutions", "brand_type": "Client", "visibility_score": 43.0, "sentiment_score": 0.65, "citation_frequency": 28, "market_share_mentions": 8.5},
    {"brand": "DataVise Analytics", "brand_type": "Client", "visibility_score": 44.0, "sentiment_score": 0.72, "citation_frequency": 31, "market_share_mentions": 9.2},
    {"brand": "Microsoft", "brand_type": "Competitor", "visibility_score": 78.5, "sentiment_score": 0.81, "citation_frequency": 42, "market_share_mentions": 15.8},
    {"brand": "Salesforce", "brand_type": "Competitor", "visibility_score": 71.2, "sentiment_score": 0.77, "citation_frequency": 38, "market_share_mentions": 13.4},
    {"brand": "HubSpot", "brand_type": "Competitor", "visibility_score": 65.8, "sentiment_score": 0.74, "citation_frequency": 35, "market_share_mentions": 11.7}
  ],
  citation_data: [
    {"source_type": "Industry Publications", "citation_frequency": 26, "avg_sentiment": 0.42, "influence_score": 0.85},
    {"source_type": "Reddit Discussions", "citation_frequency": 18, "avg_sentiment": 0.61, "influence_score": 0.73},
    {"source_type": "Company Blogs", "citation_frequency": 35, "avg_sentiment": 0.77, "influence_score": 0.68},
    {"source_type": "Review Sites", "citation_frequency": 34, "avg_sentiment": 0.70, "influence_score": 0.91},
    {"source_type": "LinkedIn Articles", "citation_frequency": 22, "avg_sentiment": 0.58, "influence_score": 0.79}
  ],
  roi_scenarios: {
    conservative: {"investment": 25000, "return": 85000, "roi": "240%", "payback_months": 8},
    realistic: {"investment": 28000, "return": 125000, "roi": "346%", "payback_months": 6},
    optimistic: {"investment": 32000, "return": 180000, "roi": "463%", "payback_months": 4}
  }
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances
let competitiveChart, marketShareChart, citationChart, breakEvenChart;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing GEO Dashboard...');
  initializeTabs();
  populateVisibilityTable();
  populateCompetitiveTable();
  
  // Delay chart initialization to ensure DOM is ready
  setTimeout(() => {
    initializeCharts();
  }, 100);
  
  initializeROICalculator();
  addInteractiveEffects();
});

// Tab Navigation - Fixed Implementation
function initializeTabs() {
  console.log('Initializing tab navigation...');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  console.log('Found', tabButtons.length, 'tab buttons and', tabPanels.length, 'tab panels');

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = button.getAttribute('data-tab');
      console.log('Tab clicked:', targetTab);
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding panel
      const targetPanel = document.getElementById(`${targetTab}-tab`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        console.log('Activated panel:', targetTab);
        
        // Initialize charts for specific tabs when they become active
        if (targetTab === 'competitive' && !competitiveChart) {
          setTimeout(() => {
            createCompetitiveChart();
            createMarketShareChart();
          }, 50);
        } else if (targetTab === 'citation' && !citationChart) {
          setTimeout(() => {
            createCitationChart();
          }, 50);
        } else if (targetTab === 'roi' && !breakEvenChart) {
          setTimeout(() => {
            createBreakEvenChart();
          }, 50);
        }
      } else {
        console.error('Target panel not found:', `${targetTab}-tab`);
      }
    });
  });
}

// Populate Visibility Table
function populateVisibilityTable() {
  const tableBody = document.getElementById('visibility-table');
  if (!tableBody) {
    console.warn('Visibility table not found');
    return;
  }

  tableBody.innerHTML = '';
  
  appData.visibility_data.forEach(item => {
    const row = document.createElement('tr');
    const sentimentClass = item.avg_sentiment >= 0 ? 'positive' : 'negative';
    
    row.innerHTML = `
      <td><strong class="brand-name">${item.brand}</strong></td>
      <td><span class="metric-value">${item.visibility_rate}%</span></td>
      <td>${item.avg_position}</td>
      <td><span class="improvement-potential">${item.improvement_potential}%</span></td>
      <td><span class="sentiment ${sentimentClass}">${(item.avg_sentiment * 100).toFixed(1)}%</span></td>
    `;
    
    tableBody.appendChild(row);
  });
  
  console.log('Visibility table populated with', appData.visibility_data.length, 'rows');
}

// Populate Competitive Table
function populateCompetitiveTable() {
  const tableBody = document.getElementById('competitive-table');
  if (!tableBody) {
    console.warn('Competitive table not found');
    return;
  }

  tableBody.innerHTML = '';
  
  appData.competitive_data.forEach(item => {
    const row = document.createElement('tr');
    const brandClass = item.brand_type === 'Client' ? 'brand-client' : 'brand-competitor';
    
    row.innerHTML = `
      <td><span class="${brandClass}">${item.brand}</span></td>
      <td><span class="status status--${item.brand_type === 'Client' ? 'info' : 'warning'}">${item.brand_type}</span></td>
      <td>${item.visibility_score}%</td>
      <td>${(item.sentiment_score * 100).toFixed(0)}%</td>
      <td>${item.citation_frequency}</td>
      <td>${item.market_share_mentions}%</td>
    `;
    
    tableBody.appendChild(row);
  });
  
  console.log('Competitive table populated');
}

// Initialize Charts
function initializeCharts() {
  console.log('Initializing charts...');
  // Only initialize charts that are visible in the current tab
  // Other charts will be initialized when their tabs are activated
}

// Competitive Positioning Chart
function createCompetitiveChart() {
  const ctx = document.getElementById('competitiveChart');
  if (!ctx) {
    console.warn('Competitive chart canvas not found');
    return;
  }

  if (competitiveChart) {
    competitiveChart.destroy();
  }

  const clientData = appData.competitive_data.filter(item => item.brand_type === 'Client');
  const competitorData = appData.competitive_data.filter(item => item.brand_type === 'Competitor');

  competitiveChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Our Brands',
        data: clientData.map(item => ({
          x: item.visibility_score,
          y: item.sentiment_score * 100
        })),
        backgroundColor: chartColors[0],
        borderColor: chartColors[0],
        pointRadius: 8
      }, {
        label: 'Competitors',
        data: competitorData.map(item => ({
          x: item.visibility_score,
          y: item.sentiment_score * 100
        })),
        backgroundColor: chartColors[2],
        borderColor: chartColors[2],
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Visibility vs Sentiment Analysis'
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Visibility Score (%)'
          },
          min: 0,
          max: 100
        },
        y: {
          title: {
            display: true,
            text: 'Sentiment Score (%)'
          },
          min: 0,
          max: 100
        }
      }
    }
  });
  
  console.log('Competitive chart created');
}

// Market Share Chart
function createMarketShareChart() {
  const ctx = document.getElementById('marketShareChart');
  if (!ctx) {
    console.warn('Market share chart canvas not found');
    return;
  }

  if (marketShareChart) {
    marketShareChart.destroy();
  }

  const labels = appData.competitive_data.map(item => item.brand);
  const data = appData.competitive_data.map(item => item.market_share_mentions);

  marketShareChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: chartColors.slice(0, labels.length),
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Market Share of Voice (%)'
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  });
  
  console.log('Market share chart created');
}

// Citation Sources Chart
function createCitationChart() {
  const ctx = document.getElementById('citationChart');
  if (!ctx) {
    console.warn('Citation chart canvas not found');
    return;
  }

  if (citationChart) {
    citationChart.destroy();
  }

  const labels = appData.citation_data.map(item => item.source_type);
  const data = appData.citation_data.map(item => item.citation_frequency);

  citationChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Citation Frequency',
        data: data,
        backgroundColor: chartColors.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Citation Sources Breakdown'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Citations'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Source Type'
          }
        }
      }
    }
  });
  
  console.log('Citation chart created');
}

// Break-Even Analysis Chart
function createBreakEvenChart() {
  const ctx = document.getElementById('breakEvenChart');
  if (!ctx) {
    console.warn('Break-even chart canvas not found');
    return;
  }

  if (breakEvenChart) {
    breakEvenChart.destroy();
  }

  // Generate monthly data for break-even analysis
  const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
  const cumulativeInvestment = Array(12).fill(28000); // Flat investment
  const cumulativeReturns = [0, 5000, 12000, 22000, 35000, 52000, 72000, 95000, 115000, 125000, 125000, 125000];

  breakEvenChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Cumulative Investment',
        data: cumulativeInvestment,
        borderColor: chartColors[2],
        backgroundColor: 'transparent',
        borderDash: [5, 5]
      }, {
        label: 'Cumulative Returns',
        data: cumulativeReturns,
        borderColor: chartColors[0],
        backgroundColor: 'transparent',
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Break-Even Analysis - Investment vs Returns'
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount ($)'
          },
          ticks: {
            callback: function(value) {
              return '$' + (value / 1000) + 'K';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Timeline'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
  
  console.log('Break-even chart created');
}

// ROI Calculator - Fixed Implementation
function initializeROICalculator() {
  console.log('Initializing ROI calculator...');
  
  const inputs = {
    investment: document.getElementById('investment'),
    visibilityLift: document.getElementById('visibility-lift'),
    avgDealSize: document.getElementById('avg-deal-size'),
    conversionRate: document.getElementById('conversion-rate')
  };

  const results = {
    roi: document.getElementById('roi-result'),
    profit: document.getElementById('profit-result'),
    payback: document.getElementById('payback-result'),
    revenue: document.getElementById('revenue-result')
  };

  // Scenario buttons - Fixed event handling
  const scenarioButtons = document.querySelectorAll('.scenario-btn');
  
  scenarioButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const scenario = button.getAttribute('data-scenario');
      console.log('Scenario button clicked:', scenario);
      
      updateScenario(scenario);
      
      // Update active button
      scenarioButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Input change handlers
  Object.values(inputs).forEach(input => {
    if (input) {
      input.addEventListener('input', calculateROI);
    }
  });

  function updateScenario(scenario) {
    console.log('Updating scenario to:', scenario);
    const scenarioData = appData.roi_scenarios[scenario];
    if (!scenarioData) {
      console.error('Scenario data not found for:', scenario);
      return;
    }

    if (inputs.investment) inputs.investment.value = scenarioData.investment;
    
    // Update visibility lift based on scenario
    const visibilityLifts = {
      conservative: 22,
      realistic: 29,
      optimistic: 37
    };
    
    if (inputs.visibilityLift) inputs.visibilityLift.value = visibilityLifts[scenario];
    
    calculateROI();
  }

  function calculateROI() {
    const investment = parseFloat(inputs.investment?.value || 28000);
    const visibilityLift = parseFloat(inputs.visibilityLift?.value || 29);
    const avgDealSize = parseFloat(inputs.avgDealSize?.value || 50000);
    const conversionRate = parseFloat(inputs.conversionRate?.value || 2.5) / 100;

    // Simplified ROI calculation
    const monthlyTrafficIncrease = (visibilityLift / 100) * 1000; // Assume 1000 base monthly visits
    const monthlyLeads = monthlyTrafficIncrease * conversionRate;
    const monthlyRevenue = monthlyLeads * avgDealSize * 0.1; // Assume 10% close rate
    const annualRevenue = monthlyRevenue * 12;
    
    const netProfit = annualRevenue - investment;
    const roi = ((annualRevenue - investment) / investment) * 100;
    const paybackMonths = Math.ceil(investment / monthlyRevenue);

    console.log('ROI Calculation:', { investment, visibilityLift, annualRevenue, netProfit, roi, paybackMonths });

    // Update results
    if (results.roi) results.roi.textContent = Math.round(roi) + '%';
    if (results.profit) results.profit.textContent = '$' + Math.round(netProfit).toLocaleString();
    if (results.payback) results.payback.textContent = paybackMonths + ' months';
    if (results.revenue) results.revenue.textContent = '$' + Math.round(monthlyRevenue).toLocaleString();
  }

  // Initialize with realistic scenario
  setTimeout(() => {
    updateScenario('realistic');
  }, 100);
}

// Add Interactive Effects
function addInteractiveEffects() {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add hover effects to action items
  const actionItems = document.querySelectorAll('.action-item');
  actionItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(4px)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });

  // Add hover effects to table rows
  const tableRows = document.querySelectorAll('tr');
  tableRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'var(--color-bg-1)';
    });
    
    row.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '';
    });
  });
}

// Export functionality simulation
document.addEventListener('DOMContentLoaded', function() {
  const exportBtn = document.querySelector('.export-actions .btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      // Simulate export functionality
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
      this.disabled = true;
      
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Export Complete';
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
        }, 2000);
      }, 1500);
    });
  }
});

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatPercentage(value) {
  return (value * 100).toFixed(1) + '%';
}

// Add CSS for enhanced styling
const style = document.createElement('style');
style.textContent = `
  .metric-value {
    font-weight: 600;
    color: var(--color-primary);
  }

  .improvement-potential {
    color: var(--color-success);
    font-weight: 500;
  }

  .sentiment.positive {
    color: var(--color-success);
  }

  .sentiment.negative {
    color: var(--color-error);
  }

  .brand-name {
    color: var(--color-primary);
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .tab-panel {
    animation: fadeIn 0.3s ease-in-out;
  }

  .chart-container canvas {
    max-height: 300px;
  }
`;

document.head.appendChild(style);

console.log('GEO Dashboard JavaScript loaded successfully');