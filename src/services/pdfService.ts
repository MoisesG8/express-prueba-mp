import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface ExpedienteData {
    expediente_id: number;
    codigo_expediente: string;
    descripcion: string;
    fecha_registro: Date;
    estado_id: number;
    estado_nombre: string;
    tecnico_registra_id: number;
    tecnico_nombre: string;
    coordinador_id: number | null;
    coordinador_nombre: string | null;
    total_indicios: number;
}

class PDFService {
    generarReporteExpedientes(
        expedientes: ExpedienteData[],
        filtros: any,
        res: Response
    ): void {
        const doc = new PDFDocument({
            size: 'LETTER',
            margins: {
                top: 50,
                bottom: 50,
                left: 40,
                right: 40
            }
        });

        // Configurar headers para descarga
        const fecha = new Date().toISOString().split('T')[0];
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=reporte-expedientes-${fecha}.pdf`
        );

        doc.pipe(res);

        // ==========================================
        // ENCABEZADO
        // ==========================================
        doc
            .fontSize(20)
            .font('Helvetica-Bold')
            .fillColor('#2c3e50')
            .text('Reporte de Expedientes', { align: 'center' })
            .moveDown(0.5);

        // Información de filtros aplicados
        doc.fontSize(10).font('Helvetica').fillColor('#000000');

        if (Object.keys(filtros).length > 0) {
            doc
                .fontSize(11)
                .font('Helvetica-Bold')
                .text('Filtros aplicados:', { underline: true })
                .moveDown(0.3)
                .fontSize(9)
                .font('Helvetica');

            if (filtros.expediente_id) {
                doc.text(`• ID Expediente: ${filtros.expediente_id}`);
            }
            if (filtros.tecnico_id) {
                doc.text(`• ID Técnico: ${filtros.tecnico_id}`);
            }
            if (filtros.coordinador_id) {
                doc.text(`• ID Coordinador: ${filtros.coordinador_id}`);
            }
            if (filtros.estado_id) {
                doc.text(`• Estado: ${filtros.estado_id}`);
            }
            if (filtros.fecha_inicio) {
                doc.text(`• Fecha inicio: ${new Date(filtros.fecha_inicio).toLocaleDateString('es-GT')}`);
            }
            if (filtros.fecha_fin) {
                doc.text(`• Fecha fin: ${new Date(filtros.fecha_fin).toLocaleDateString('es-GT')}`);
            }

            doc.moveDown();
        }

        // Resumen
        doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor('#2c3e50')
            .text(`Total de expedientes: ${expedientes.length}`, { align: 'center' })
            .fillColor('#000000')
            .moveDown();

        // Línea separadora
        doc
            .moveTo(40, doc.y)
            .lineTo(572, doc.y)
            .lineWidth(2)
            .strokeColor('#3498db')
            .stroke()
            .strokeColor('#000000')
            .lineWidth(1)
            .moveDown();

        // ==========================================
        // LISTADO DE EXPEDIENTES
        // ==========================================
        expedientes.forEach((exp, index) => {
            // Verificar si necesitamos nueva página
            if (doc.y > 650) {
                doc.addPage();

                // Repetir encabezado en nueva página
                doc
                    .fontSize(14)
                    .font('Helvetica-Bold')
                    .fillColor('#2c3e50')
                    .text('Reporte de Expedientes (continuación)', { align: 'center' })
                    .fillColor('#000000')
                    .moveDown();
            }

            // Caja con fondo para cada expediente
            const boxY = doc.y;

            // Fondo gris claro alternado
            if (index % 2 === 0) {
                doc
                    .rect(40, boxY - 5, 532, 85)
                    .fillColor('#f8f9fa')
                    .fill()
                    .fillColor('#000000');
            }

            // Número y código de expediente
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text(`${index + 1}. ${exp.codigo_expediente}`, 50, boxY, { continued: false });

            // Estado con badge de color
            const estadoX = 450;
            this.dibujarBadgeEstado(doc, exp.estado_nombre, estadoX, boxY);

            // Información del expediente
            doc
                .fontSize(9)
                .font('Helvetica')
                .fillColor('#000000');

            doc.text(`ID: ${exp.expediente_id}`, 50, doc.y + 5);

            // Descripción (limitada a 80 caracteres)
            const descripcionCorta = exp.descripcion.length > 80
                ? exp.descripcion.substring(0, 80) + '...'
                : exp.descripcion;
            doc.text(`Descripción: ${descripcionCorta}`, 50, doc.y + 3, { width: 480 });

            // Fechas y personal
            const infoY = doc.y + 3;
            doc.text(`Fecha registro: ${new Date(exp.fecha_registro).toLocaleDateString('es-GT')}`, 50, infoY);

            doc.text(`Técnico: ${exp.tecnico_nombre}`, 50, doc.y + 3);

            if (exp.coordinador_nombre) {
                doc.text(`Coordinador: ${exp.coordinador_nombre}`, 50, doc.y + 3);
            } else {
                doc.text(`Coordinador: Sin asignar`, 50, doc.y + 3);
            }

            // Total de indicios
            doc
                .font('Helvetica-Bold')
                .text(`Total de indicios: ${exp.total_indicios}`, 50, doc.y + 3);

            // Espacio entre expedientes
            doc.moveDown(1.5);
        });

        // ==========================================
        // ESTADÍSTICAS (si hay datos)
        // ==========================================
        if (expedientes.length > 0) {
            // Verificar espacio para estadísticas
            if (doc.y > 600) {
                doc.addPage();
            }

            doc
                .moveDown()
                .fontSize(14)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text('Resumen Estadístico', { align: 'center' })
                .moveDown();

            doc
                .moveTo(40, doc.y)
                .lineTo(572, doc.y)
                .lineWidth(1)
                .strokeColor('#3498db')
                .stroke()
                .moveDown();

            // Calcular estadísticas
            const totalIndicios = expedientes.reduce((sum, exp) => sum + exp.total_indicios, 0);
            const promedioIndicios = (totalIndicios / expedientes.length).toFixed(2);

            // Contar por estado
            const estadosCont: { [key: string]: number } = {};
            expedientes.forEach(exp => {
                estadosCont[exp.estado_nombre] = (estadosCont[exp.estado_nombre] || 0) + 1;
            });

            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#000000');

            doc.text(`• Total de expedientes: ${expedientes.length}`);
            doc.text(`• Total de indicios registrados: ${totalIndicios}`);
            doc.text(`• Promedio de indicios por expediente: ${promedioIndicios}`);
            doc.moveDown(0.5);

            doc.font('Helvetica-Bold').text('Expedientes por estado:');
            doc.font('Helvetica');

            Object.entries(estadosCont).forEach(([estado, cantidad]) => {
                doc.text(`  - ${estado}: ${cantidad}`);
            });
        }

        // ==========================================
        // PIE DE PÁGINA EN TODAS LAS PÁGINAS
        // ==========================================
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
            doc.switchToPage(i);

            const fechaHora = new Date().toLocaleString('es-GT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Línea superior del pie
            doc
                .moveTo(40, doc.page.height - 60)
                .lineTo(572, doc.page.height - 60)
                .strokeColor('#e0e0e0')
                .stroke();

            doc
                .fontSize(8)
                .fillColor('#666666')
                .text(
                    `Página ${i + 1} de ${totalPages}`,
                    40,
                    doc.page.height - 45,
                    { align: 'left' }
                )
                .text(
                    `Generado: ${fechaHora}`,
                    0,
                    doc.page.height - 45,
                    { align: 'center' }
                )
                .text(
                    'Sistema de Expedientes',
                    0,
                    doc.page.height - 45,
                    { align: 'right', width: 532 }
                );
        }

        doc.end();
    }

    private dibujarBadgeEstado(doc: PDFKit.PDFDocument, estado: string, x: number, y: number): void {
        // Definir colores según el estado
        const coloresEstado: { [key: string]: { bg: string, text: string } } = {
            'Pendiente': { bg: '#fff3cd', text: '#856404' },
            'En Proceso': { bg: '#cfe2ff', text: '#084298' },
            'Completado': { bg: '#d1e7dd', text: '#0f5132' },
            'Cerrado': { bg: '#e2e3e5', text: '#41464b' },
            'Cancelado': { bg: '#f8d7da', text: '#842029' }
        };

        const color = coloresEstado[estado] || { bg: '#e0e0e0', text: '#000000' };

        // Dibujar rectángulo de fondo
        doc
            .rect(x, y, 80, 18)
            .fillColor(color.bg)
            .fill()
            .fillColor('#000000');

        // Texto del estado
        doc
            .fontSize(8)
            .font('Helvetica-Bold')
            .fillColor(color.text)
            .text(estado, x, y + 5, { width: 80, align: 'center' })
            .fillColor('#000000');
    }
}

export default new PDFService();