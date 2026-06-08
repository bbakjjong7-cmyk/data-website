// Tab Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const summaryCards = document.querySelectorAll('.summary-card');

    function switchTab(tabId) {
        // Update Nav
        navItems.forEach(item => {
            if(item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Content
        tabContents.forEach(content => {
            if(content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.dataset.tab);
        });
    });

    summaryCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetTab = card.dataset.trigger;
            if (targetTab) {
                switchTab(targetTab);
            }
        });
    });

    // Chart.js Global Defaults for Dark Theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', 'Noto Sans KR', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 17, 26, 0.9)';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';

    // --- Heatmap Coloring Logic ---
    const heatmapCells = document.querySelectorAll('.heatmap-table td[data-value]');
    heatmapCells.forEach(cell => {
        const val = parseFloat(cell.dataset.value);
        let color = '';
        if (val === 1) {
            color = '#312e81'; // deepest
        } else if (val >= 0.8) {
            color = '#4338ca';
        } else if (val >= 0.6) {
            color = '#4f46e5';
        } else if (val >= 0.4) {
            color = '#6366f1';
        } else if (val >= 0.2) {
            color = '#818cf8';
        } else if (val >= 0) {
            color = '#a5b4fc';
        } else if (val >= -0.2) {
            color = '#c7d2fe';
        } else if (val >= -0.4) {
            color = '#e0e7ff'; // lightest/negative
        } else {
            color = '#f1f5f9';
        }
        cell.style.backgroundColor = color;
        // Text color contrast
        if (val >= 0.4) {
            cell.style.color = '#ffffff';
        } else {
            cell.style.color = '#0f111a';
        }
    });

    // --- Chart 1: 스마트폰 사용과 과의존 [그래프1] (정규화) ---
    const ctx1 = document.getElementById('chart-h1-1').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['2016', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: '스마트기기 활용시간 평일 (0~100)',
                    data: [27.27, 18.18, 18.18, 100, 81.81, 9.09, 9.09, 0],
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '스마트기기 활용시간 휴일 (0~100)',
                    data: [16.67, 33.33, 16.67, 100, 83.33, 16.67, 16.67, 0],
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '과의존 위험군 청소년 (0~100)',
                    data: [9.77, 0, 6.77, 48.87, 57.89, 81.20, 81.20, 100],
                    borderColor: '#10b981',
                    borderWidth: 3,
                    pointRadius: 5,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: '정규화 값 (0~100)' }
                }
            }
        }
    });

    // --- Chart 1-2: 스마트폰 사용과 과의존 [그래프2] (코로나 제외, 정규화) ---
    const ctx1_2 = document.getElementById('chart-h1-2').getContext('2d');
    new Chart(ctx1_2, {
        type: 'line',
        data: {
            labels: ['2016', '2018', '2019', '2022', '2023', '2024'],
            datasets: [
                {
                    label: '평일 활용시간 (0~100)',
                    data: [100, 66.67, 66.67, 33.33, 33.33, 0],
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '휴일 활용시간 (0~100)',
                    data: [50, 100, 50, 50, 50, 0],
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '과의존 위험군 (0~100)',
                    data: [9.77, 0, 6.77, 81.20, 81.20, 100],
                    borderColor: '#10b981',
                    borderWidth: 3,
                    pointRadius: 5,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: '정규화 값 (0~100)' }
                }
            }
        }
    });

    // --- Chart 2: 주중 좌식시간과 비만율 (산점도 및 회귀선) ---
    // 데이터 포인트
    const sedentaryTime = [2.4, 2.5, 3.1, 2.8, 3.8, 3.5, 3.1, 3.4, 3.3];
    const obesityRate = [9.1, 10.0, 10.8, 11.1, 12.1, 13.5, 12.1, 12.0, 12.5];
    const scatterData = sedentaryTime.map((x, i) => ({ x: x, y: obesityRate[i] }));
    
    // 단순 회귀선 (y = ax + b) 계산 (추정치)
    // a = 2.4, b = 3.5 정도의 기울기
    const ctx2 = document.getElementById('chart-h2-1').getContext('2d');
    new Chart(ctx2, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: '연도별 데이터 (2016~2024)',
                    data: scatterData,
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: '추세선 (r=0.93)',
                    data: [{x: 2.2, y: 8.5}, {x: 4.0, y: 13.5}],
                    type: 'line',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: '주중 좌식시간 (시간)' }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: '비만율 (%)' }
                }
            }
        }
    });

    // --- Chart 3: 사이버폭력/혐오표현 및 정신건강 ---
    const ctx3 = document.getElementById('chart-h3-1').getContext('2d');
    new Chart(ctx3, {
        type: 'line',
        data: {
            labels: ['2017', '2020', '2021', '2022', '2023', '2024', '2025'],
            datasets: [
                {
                    label: '사이버폭력 피해 경험률 (%)',
                    data: [null, null, 23.4, 37.5, 36.8, 37.1, 37.5],
                    borderColor: '#ef4444',
                    borderWidth: 3,
                    spanGaps: true,
                    tension: 0.3
                },
                {
                    label: '디지털 혐오표현 경험률 (%)',
                    data: [null, null, 20.8, 12.5, 14.2, 18.6, 19.3],
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    spanGaps: true,
                    tension: 0.3
                },
                {
                    label: '주관적 정신건강 긍정 응답률 (%)',
                    data: [46.7, 43.2, null, null, 34.7, null, null],
                    borderColor: '#10b981',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    spanGaps: true,
                    tension: 0.1,
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: { display: true, text: '비율 (%)' }
                }
            }
        }
    });

    // --- Chart 4: YWI Index (회귀선 포함) ---
    const ctx4 = document.getElementById('chart-ywi').getContext('2d');
    new Chart(ctx4, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'YWI 지수 (실제)',
                    data: [66.55, 28.13, 55.20, 51.11, 33.65],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderWidth: 4,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 3,
                    fill: true,
                    tension: 0.2
                },
                {
                    label: '추세선 (기울기: -4.28)',
                    data: [62, 57.72, 53.44, 49.16, 44.88], // 대략적인 선형 회귀 값
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    titleFont: { size: 14 },
                    bodyFont: { size: 16, weight: 'bold' },
                    displayColors: false
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: 'YWI 점수' }
                }
            }
        }
    });
});
