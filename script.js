// ===== STATE MANAGEMENT =====
let currentSubsection = null;
const fileInput = document.getElementById('file-input');

// Store PDFs in localStorage
const getPDFsFromStorage = () => {
    const stored = localStorage.getItem('baccalaureat-pdfs');
    return stored ? JSON.parse(stored) : {
        history: [],
        geography: [],
        connaissance: [],
        litterature: []
    };
};

const savePDFsToStorage = (pdfs) => {
    localStorage.setItem('baccalaureat-pdfs', JSON.stringify(pdfs));
};

// ===== NAVIGATION =====
const navButtons = document.querySelectorAll('.nav-btn');
const strands = document.querySelectorAll('.strand');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const strandId = btn.dataset.strand;
        
        // Remove active class from all
        navButtons.forEach(b => b.classList.remove('active'));
        strands.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        document.getElementById(strandId).classList.add('active');
    });
});

// ===== PDF MANAGEMENT =====
const addPdfButtons = document.querySelectorAll('.add-pdf-btn');

addPdfButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentSubsection = btn.dataset.subsection;
        fileInput.click();
    });
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !currentSubsection) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const pdfs = getPDFsFromStorage();
        const pdfData = {
            id: Date.now(),
            name: file.name,
            data: event.target.result,
            uploadDate: new Date().toLocaleDateString()
        };

        pdfs[currentSubsection].push(pdfData);
        savePDFsToStorage(pdfs);
        renderPDFs(currentSubsection);
        fileInput.value = '';
    };
    reader.readAsDataURL(file);
});

// ===== RENDER PDFs =====
const renderPDFs = (subsection) => {
    const pdfs = getPDFsFromStorage();
    const pdfList = document.getElementById(`${subsection}-pdfs`);
    const pdfArray = pdfs[subsection] || [];

    pdfList.innerHTML = '';

    if (pdfArray.length === 0) {
        pdfList.innerHTML = '<p class="empty-message">No PDFs yet. Add your first study material!</p>';
        return;
    }

    pdfArray.forEach(pdf => {
        const pdfItem = document.createElement('div');
        pdfItem.className = 'pdf-item';
        pdfItem.innerHTML = `
            <div class="pdf-info">
                <span class="pdf-icon">📄</span>
                <a class="pdf-name" href="${pdf.data}" download="${pdf.name}">
                    ${pdf.name}
                </a>
            </div>
            <div class="pdf-actions">
                <button class="pdf-btn pdf-download-btn" title="Download" onclick="downloadPDF('${pdf.name}', '${pdf.data}')">
                    ⬇️
                </button>
                <button class="pdf-btn pdf-delete-btn" title="Delete" onclick="deletePDF('${subsection}', ${pdf.id})">
                    ✕
                </button>
            </div>
        `;
        pdfList.appendChild(pdfItem);
    });
};

// ===== PDF DOWNLOAD =====
const downloadPDF = (name, data) => {
    const link = document.createElement('a');
    link.href = data;
    link.download = name;
    link.click();
};

// ===== PDF DELETE =====
const deletePDF = (subsection, id) => {
    if (confirm('Are you sure you want to delete this PDF?')) {
        const pdfs = getPDFsFromStorage();
        pdfs[subsection] = pdfs[subsection].filter(pdf => pdf.id !== id);
        savePDFsToStorage(pdfs);
        renderPDFs(subsection);
    }
};

// ===== INITIALIZE =====
const initializePDFs = () => {
    renderPDFs('history');
    renderPDFs('geography');
    renderPDFs('connaissance');
    renderPDFs('litterature');
};

// Load PDFs on page load
document.addEventListener('DOMContentLoaded', initializePDFs);
