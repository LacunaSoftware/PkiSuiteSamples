const fs = require('fs');
const path = require('path');
const { StorageMock } = require('./storage-mock');
const uuidv4 = require('uuid/v4');
const PDFDocument = require('pdfkit');

const APP_ROOT = process.cwd();

class Prescricao {
    static generateReceitaSimples(name, crm, crmUf){

        const defaultLabel = [ 
            'Nome do(a) Médico(a):',
            'CRM:',
            'CRM UF:',
            'Nome do Paciente:', 
            'Local de Atendimento:', 
            'Telefone:', 
            'Endereço:', 
            'Cidade:', 
            'Bairro:', 
            'CNES:', 
            'UF:',
            'Data de Emissão:', 
            'Prescrição:',
        ];
        const defaultValues = [
            name,
            crm,
            crmUf,
            'Maria da Silva',
            'Clínica Local',
            '+00 (00) 0000-0000',
            'Complexo Hospitalar',
            'Brasília',
            'Bairro do Mar',
            '0000000',
            'DF',
            '00/00/0000',
            'Dipirona ------- 1 comprimido de 12 em 12 horas por 3 dias',
        ];

        // Create temporary file.
        const outputFile = `${uuidv4()}.pdf`;
        StorageMock.createAppDataSync(); // Make sure the 'app-data' folder exists.
        let dest = path.join(APP_ROOT, 'app-data', outputFile);

        const doc = new PDFDocument({
            size: 'A4',
            // REQUIRED!
            // Add all the following metadata
            info: {
                '2.16.76.1.12.1.1': '',     // Prescrição de medicamento
                '2.16.76.1.4.2.2.1': crm,   // CRM
                '2.16.76.1.4.2.2.2': crmUf, // CRM UF
                '2.16.76.1.4.2.2.3': '',    // Especialidade
                '2.16.76.1.4.2.3.1': '',    // CRF
                '2.16.76.1.4.2.3.2': '',    // CRF UF
                '2.16.76.1.4.2.3.3': '',    // Especialidade
              }
            });

        // Stream contents to dest file
        doc.pipe(fs.createWriteStream(dest));

        // Add title.
        doc.fontSize(20);
        doc.font('Times-Bold')
            .text('RECEITUÁRIO SIMPLES', {align: 'center'})
            .moveDown(1);

        // Initialize Form
        doc.fontSize(12).font('Helvetica');

        // Add text
        defaultLabel.forEach((label, idx) => {
            doc.text(label, 72)
            .moveUp(1)
            .text(defaultValues[idx], 210)
            .moveDown(1);
        });

        doc.end();

        return outputFile;
    }
}

exports.Prescricao = Prescricao;