interface AppointmentEmailData {
  patientName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorName?: string;
  notes?: string;
  confirmationLink?: string;
  cancelLink?: string;
}

export function appointmentConfirmationEmailTemplate(
  data: AppointmentEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Cita - PsyBook</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
          /* .logo eliminado */
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px 24px 16px 24px; text-align: center; }
          .header h1 { font-size: 24px; margin-bottom: 8px; font-weight: 700; }
          .content { padding: 32px 24px; }
          .greeting { font-size: 16px; color: #1e293b; margin-bottom: 20px; }
          .appointment-details { background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 24px 0; }
          .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #0f172a; min-width: 120px; }
          .detail-value { color: #475569; margin-left: 16px; flex: 1; }
          .footer { background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
          .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; margin-top: 16px; font-size: 14px; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmación de Cita</h1>
            <p>Tu cita ha sido agendada exitosamente</p>
          </div>

          <div class="content">
            <p class="greeting">Hola <strong>${data.patientName}</strong>,</p>

            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Nos complace confirmar tu cita. A continuación encontrarás todos los detalles:
            </p>

            <div class="appointment-details">
              <div class="detail-row">
                <span class="detail-label">Fecha</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Hora</span>
                <span class="detail-value">${data.startTime} - ${data.endTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Servicio</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
              ${data.doctorName ? `
              <div class="detail-row">
                <span class="detail-label">Psicólogo</span>
                <span class="detail-value">${data.doctorName}</span>
              </div>
              ` : ""}
            </div>

            ${data.notes ? `
            <div class="note">
              <strong>Notas:</strong><br/>
              ${data.notes}
            </div>
            ` : ""}

            <p style="color: #475569; margin-top: 24px; line-height: 1.6;">
              Si necesitas cancelar o reprogramar tu cita, comunícate con nosotros con al menos 24 horas de anticipación.
            </p>
          </div>

          <div class="footer">
            <p>© 2026 PsyBook. Todos los derechos reservados.</p>
            <p style="margin-top: 8px;">Este es un email automático. Por favor no responder este correo.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function appointmentReminderEmailTemplate(
  data: AppointmentEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Cita - PsyBook</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 32px 24px; text-align: center; }
          .header h1 { font-size: 24px; margin-bottom: 8px; }
          .content { padding: 32px 24px; }
          .greeting { font-size: 16px; color: #1e293b; margin-bottom: 20px; }
          .appointment-details { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 6px; margin: 24px 0; }
          .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #0f172a; min-width: 120px; }
          .detail-value { color: #475569; margin-left: 16px; flex: 1; }
          .footer { background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Recordatorio de Cita</h1>
            <p>Tu cita es mañana</p>
          </div>

          <div class="content">
            <p class="greeting">Hola <strong>${data.patientName}</strong>,</p>

            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Te recordamos que tienes una cita programada para mañana. ¡Asegúrate de no olvidarla!
            </p>

            <div class="appointment-details">
              <div class="detail-row">
                <span class="detail-label">📅 Fecha</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Hora</span>
                <span class="detail-value">${data.startTime} - ${data.endTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🏥 Servicio</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
            </div>

            <p style="color: #475569; margin-top: 20px; line-height: 1.6;">
              Si no puedes asistir, por favor cancela con tiempo para que otro paciente pueda agendar.
            </p>

            <p style="color: #475569; margin-top: 20px; line-height: 1.6;">
              ¡Te esperamos! 👋
            </p>
          </div>

          <div class="footer">
            <p>© 2026 PsyBook. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function appointmentCancellationEmailTemplate(
  data: AppointmentEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cita Cancelada - PsyBook</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 32px 24px; text-align: center; }
          .header h1 { font-size: 24px; margin-bottom: 8px; }
          .content { padding: 32px 24px; }
          .greeting { font-size: 16px; color: #1e293b; margin-bottom: 20px; }
          .appointment-details { background: #f8fafc; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin: 24px 0; }
          .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #0f172a; min-width: 120px; }
          .detail-value { color: #475569; margin-left: 16px; flex: 1; }
          .footer { background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Cita Cancelada</h1>
            <p>Tu cita ha sido cancelada</p>
          </div>

          <div class="content">
            <p class="greeting">Hola <strong>${data.patientName}</strong>,</p>

            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Lamentablemente, tu cita ha sido cancelada. A continuación encontrarás los detalles:
            </p>

            <div class="appointment-details">
              <div class="detail-row">
                <span class="detail-label">📅 Fecha</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Hora</span>
                <span class="detail-value">${data.startTime} - ${data.endTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🏥 Servicio</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
            </div>

            <p style="color: #475569; margin-top: 20px; line-height: 1.6;">
              Si deseas agendar una nueva cita, por favor comunícate con nosotros.
            </p>

            <p style="color: #475569; margin-top: 20px; line-height: 1.6;">
              Disculpen las molestias. ⚠️
            </p>
          </div>

          <div class="footer">
            <p>© 2026 PsyBook. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
