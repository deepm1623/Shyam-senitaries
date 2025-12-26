
class CustomPopup {
  constructor() {
    this.createPopupHTML();
    this.bindEvents();
  }

  createPopupHTML() {
    const popupContainer = document.createElement('div');
    popupContainer.id = 'custom-popup-container';
    popupContainer.innerHTML = `
      <div id="custom-popup-overlay" class="custom-popup-overlay">
        <div id="custom-popup" class="custom-popup">
          <div class="custom-popup-header">
            <div id="custom-popup-icon" class="custom-popup-icon info">
              <i class='bx bx-info-circle'></i>
            </div>
            <span id="custom-popup-title" class="custom-popup-title">Shyam Sanitaries</span>
          </div>
          <div class="custom-popup-body">
            <p id="custom-popup-message" class="custom-popup-message"></p>
          </div>
          <div class="custom-popup-footer">
            <button id="custom-popup-ok" class="custom-popup-btn custom-popup-btn-primary">OK</button>
          </div>
        </div>
      </div>
    `;

    
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 10000;
        backdrop-filter: blur(10px) saturate(180%);
        -webkit-backdrop-filter: blur(10px) saturate(180%);
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .custom-popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        padding: 0;
        min-width: 350px;
        max-width: 500px;
        box-shadow: 
          0 20px 60px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: popupSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .custom-popup::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #00c6ff, #0072ff, #00c6ff);
        background-size: 200% 100%;
        animation: gradientShift 3s ease infinite;
      }

      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      @keyframes popupSlideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -60%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }

      .custom-popup-header {
        padding: 25px 25px 15px 25px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .custom-popup-icon {
        font-size: 28px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .custom-popup-icon.success {
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        color: #fff;
        box-shadow: 0 4px 16px rgba(0, 198, 255, 0.4);
      }

      .custom-popup-icon.error {
        background: linear-gradient(135deg, #ff4444, #ff6666);
        color: #fff;
        box-shadow: 0 4px 16px rgba(255, 68, 68, 0.4);
      }

      .custom-popup-icon.info {
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        color: #fff;
        box-shadow: 0 4px 16px rgba(0, 198, 255, 0.4);
      }

      .custom-popup-icon.warning {
        background: linear-gradient(135deg, #ffa500, #ff8c00);
        color: #fff;
        box-shadow: 0 4px 16px rgba(255, 165, 0, 0.4);
      }

      .custom-popup-title {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: 'Poppins', sans-serif;
        flex: 1;
      }

      .custom-popup-body {
        padding: 25px;
      }

      .custom-popup-message {
        color: rgba(255, 255, 255, 0.95);
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }

      .custom-popup-footer {
        padding: 15px 25px 25px 25px;
        text-align: right;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .custom-popup-btn {
        padding: 12px 28px;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Poppins', sans-serif;
        min-width: 100px;
        letter-spacing: 0.5px;
      }

      .custom-popup-btn-primary {
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        color: #fff;
        box-shadow: 
          0 4px 16px rgba(0, 198, 255, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .custom-popup-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 
          0 6px 20px rgba(0, 198, 255, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }

      .custom-popup-btn-primary:active {
        transform: translateY(0);
      }

      .custom-popup-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-right: 12px;
        backdrop-filter: blur(10px);
      }

      .custom-popup-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .custom-popup {
          min-width: 300px;
          max-width: 90%;
          margin: 20px;
        }
        
        .custom-popup-header {
          padding: 20px 20px 12px 20px;
        }

        .custom-popup-icon {
          width: 40px;
          height: 40px;
          font-size: 24px;
        }
        
        .custom-popup-title {
          font-size: 16px;
        }
        
        .custom-popup-body {
          padding: 20px;
        }

        .custom-popup-message {
          font-size: 14px;
        }

        .custom-popup-footer {
          padding: 12px 20px 20px 20px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(popupContainer);
  }

  bindEvents() {
    const okBtn = document.getElementById('custom-popup-ok');
    const overlay = document.getElementById('custom-popup-overlay');

    okBtn.addEventListener('click', () => {
      this.hide();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hide();
      }
    });

    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  }

  show(message, title = 'Shyam Sanitaries', type = 'info') {
    const overlay = document.getElementById('custom-popup-overlay');
    const messageEl = document.getElementById('custom-popup-message');
    const titleEl = document.getElementById('custom-popup-title');
    const iconEl = document.getElementById('custom-popup-icon');

    messageEl.textContent = message;
    titleEl.textContent = title;
    
    iconEl.className = `custom-popup-icon ${type}`;
    const icons = {
      success: 'bx-check-circle',
      error: 'bx-error-circle',
      warning: 'bx-error',
      info: 'bx-info-circle'
    };
    iconEl.innerHTML = `<i class='bx ${icons[type] || icons.info}'></i>`;
    
    overlay.style.display = 'block';

    setTimeout(() => {
      document.getElementById('custom-popup-ok').focus();
    }, 100);
  }

  hide() {
    const overlay = document.getElementById('custom-popup-overlay');
    overlay.style.display = 'none';
  }

  isVisible() {
    const overlay = document.getElementById('custom-popup-overlay');
    return overlay.style.display === 'block';
  }
}


class CustomConfirm {
  constructor() {
    this.createConfirmHTML();
    this.bindEvents();
  }

  createConfirmHTML() {
    const confirmContainer = document.createElement('div');
    confirmContainer.id = 'custom-confirm-container';
    confirmContainer.innerHTML = `
      <div id="custom-confirm-overlay" class="custom-confirm-overlay">
        <div id="custom-confirm" class="custom-confirm">
          <div class="custom-confirm-header">
            <div class="custom-confirm-icon">
              <i class='bx bx-error'></i>
            </div>
            <span id="custom-confirm-title" class="custom-confirm-title">Shyam Sanitaries</span>
          </div>
          <div class="custom-confirm-body">
            <p id="custom-confirm-message" class="custom-confirm-message"></p>
          </div>
          <div class="custom-confirm-footer">
            <button id="custom-confirm-cancel" class="custom-popup-btn custom-popup-btn-secondary">Cancel</button>
            <button id="custom-confirm-ok" class="custom-popup-btn custom-popup-btn-primary">OK</button>
          </div>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent += `
      .custom-confirm-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 10001;
        backdrop-filter: blur(10px) saturate(180%);
        -webkit-backdrop-filter: blur(10px) saturate(180%);
        animation: fadeIn 0.3s ease;
      }

      .custom-confirm {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        padding: 0;
        min-width: 350px;
        max-width: 500px;
        box-shadow: 
          0 20px 60px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: popupSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .custom-confirm::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #00c6ff, #0072ff, #00c6ff);
        background-size: 200% 100%;
        animation: gradientShift 3s ease infinite;
      }

      .custom-confirm-header {
        padding: 25px 25px 15px 25px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .custom-confirm-icon {
        font-size: 28px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: linear-gradient(135deg, #ffa500, #ff8c00);
        color: #fff;
        box-shadow: 0 4px 16px rgba(255, 165, 0, 0.4);
      }

      .custom-confirm-title {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: 'Poppins', sans-serif;
        flex: 1;
      }

      .custom-confirm-body {
        padding: 25px;
      }

      .custom-confirm-message {
        color: rgba(255, 255, 255, 0.95);
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }

      .custom-confirm-footer {
        padding: 15px 25px 25px 25px;
        text-align: right;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(confirmContainer);
  }

  bindEvents() {
    const okBtn = document.getElementById('custom-confirm-ok');
    const cancelBtn = document.getElementById('custom-confirm-cancel');
    const overlay = document.getElementById('custom-confirm-overlay');

    okBtn.addEventListener('click', () => {
      this.hide(true);
    });

    cancelBtn.addEventListener('click', () => {
      this.hide(false);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hide(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide(false);
      }
    });
  }

  show(message, title = 'Shyam Sanitaries') {
    return new Promise((resolve) => {
      this.resolve = resolve;
      
      const overlay = document.getElementById('custom-confirm-overlay');
      const messageEl = document.getElementById('custom-confirm-message');
      const titleEl = document.getElementById('custom-confirm-title');

      messageEl.textContent = message;
      titleEl.textContent = title;
      overlay.style.display = 'block';

      setTimeout(() => {
        document.getElementById('custom-confirm-cancel').focus();
      }, 100);
    });
  }

  hide(result) {
    const overlay = document.getElementById('custom-confirm-overlay');
    overlay.style.display = 'none';
    
    if (this.resolve) {
      this.resolve(result);
      this.resolve = null;
    }
  }

  isVisible() {
    const overlay = document.getElementById('custom-confirm-overlay');
    return overlay.style.display === 'block';
  }
}


let customPopup, customConfirm;

document.addEventListener('DOMContentLoaded', function() {
  customPopup = new CustomPopup();
  customConfirm = new CustomConfirm();
});


function customAlert(message, title = 'Shyam Sanitaries', type = 'info') {
  if (customPopup) {
    customPopup.show(message, title, type);
  } else {
    setTimeout(() => {
      if (customPopup) {
        customPopup.show(message, title, type);
      } else {
        alert(message);
      }
    }, 100);
  }
}


function showSuccess(message, title = 'Success') {
  customAlert(message, title, 'success');
}

function showError(message, title = 'Error') {
  customAlert(message, title, 'error');
}

function showWarning(message, title = 'Warning') {
  customAlert(message, title, 'warning');
}

function showInfo(message, title = 'Information') {
  customAlert(message, title, 'info');
}

async function customConfirmDialog(message, title = 'Shyam Sanitaries') {
  if (customConfirm) {
    return await customConfirm.show(message, title);
  } else {
    setTimeout(async () => {
      if (customConfirm) {
        return await customConfirm.show(message, title);
      } else {
        return confirm(message);
      }
    }, 100);
  }
}

window.alert = customAlert;
window.confirm = customConfirmDialog;

window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;


