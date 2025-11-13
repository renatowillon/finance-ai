import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";

export async function POST(req: Request) {
  const { cliente, vencimento, site, email } = await req.json();

  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "renatowillon@gmail.com",
      pass: process.env.EMAIL_KEY,
    },
  });

  try {
    await transporter.sendMail({
      from: "Renovação de Hospedagem",
      to: email,
      subject: "Renovação de Hospedagem - Black Friday",
      html: `
        
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #f4f6f8; padding: 40px 0"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="680"
            style="
              max-width: 680px;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background: #111827;
                  padding: 24px 28px;
                  text-align: center;
                "
              >
                <img
                  src="https://agenciawdev.vercel.app/img/logoBranca.png"
                  alt="wDev Logo"
                  width="200"
                  style="display: inline-block; border: 0"
                />
              </td>
            </tr>

            <!-- Título -->
            <tr>
              <td style="padding: 18px 28px 6px 28px; text-align: center">
                <h1 style="margin: 0; font-size: 22px; color: #111827">
                  🚨 Sua hospedagem está prestes a expirar!
                </h1>
                <p style="color: #374151; margin-top: 8px; font-size: 15px">
                  Oferta exclusiva de <strong>Black Friday</strong> — válida até
                  28 Novembro 2025
                </p>
              </td>
            </tr>

            <!-- Corpo -->
            <tr>
              <td
                style="
                  padding: 8px 28px 20px 28px;
                  color: #374151;
                  line-height: 1.6;
                  font-size: 15px;
                "
              >
                <p>Olá <strong>${cliente}</strong>, tudo bem?</p>
                <p>
                  A hospedagem do seu site <strong>${site}</strong> vence em
                  <strong style="color: #b91c1c">${vencimento}</strong>. Para
                  continuar com o site ativo e aproveitar descontos incríveis,
                  confira nossos planos abaixo:
                </p>
              </td>
            </tr>

            <!-- Planos em Cards -->
            <tr>
              <td align="center" style="padding: 0 28px 30px 28px">
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="text-align: center"
                >
                  <tr>
                    <!-- Card 1 -->
                    <td
                      style="
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        padding: 20px;
                        width: 33%;
                        vertical-align: top;
                      "
                    >
                      <h3 style="margin: 0; font-size: 18px; color: #111827">
                        Mensal
                      </h3>
                      <p style="margin: 8px 0; font-size: 14px; color: #6b7280">
                        Renovação tradicional
                      </p>
                      <p
                        style="
                          font-size: 26px;
                          font-weight: bold;
                          color: #111827;
                          margin: 10px 0;
                        "
                      >
                        R$ 99,90<span style="font-size: 14px; font-weight: 400"
                          >/mês</span
                        >
                      </p>
                      <p
                        style="
                          font-size: 13px;
                          color: #6b7280;
                          margin: 0 0 14px 0;
                        "
                      >
                        Ideal para quem quer renovar mês a mês.
                      </p>
                      <a
                        href="https://wa.me/5583988332659?text=Gerar%20pagamento%20para%20renovação%20mensal"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 10px 18px;
                          background: #6b7280;
                          color: #fff;
                          border-radius: 8px;
                          text-decoration: none;
                          font-weight: 600;
                        "
                      >
                        Assinar Mensal
                      </a>
                    </td>

                    <!-- Espaço -->
                    <td width="16"></td>

                    <!-- Card 2 -->
                    <td
                      style="
                        background: #111827;
                        color: #fff;
                        border-radius: 10px;
                        padding: 20px;
                        width: 33%;
                        vertical-align: top;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                      "
                    >
                      <h3 style="margin: 0; font-size: 18px">Plano 6 Meses</h3>
                      <p style="margin: 8px 0; font-size: 14px; opacity: 0.8">
                        🔥 Oferta Black Friday
                      </p>
                      <p
                        style="
                          font-size: 26px;
                          font-weight: bold;
                          margin: 10px 0;
                        "
                      >
                        R$ 69,90<span style="font-size: 14px; font-weight: 400"
                          >/mês</span
                        >
                      </p>
                      <p
                        style="
                          font-size: 13px;
                          opacity: 0.9;
                          margin: 0 0 14px 0;
                        "
                      >
                        💰 Total: R$ 419,40<br />
                        + Economia de R$ 180,00
                      </p>
                      <a
                        href="https://wa.me/5583988332659?text=Gerar%20pagamento%20para%20renovação%206%20meses"
                        target="_blank"
                        style="
                          display: inline-block;
                          margin-top: 4px;
                          padding: 12px 20px;
                          background: #0b76ef;
                          color: #fff;
                          border-radius: 8px;
                          text-decoration: none;
                          font-weight: 600;
                          box-shadow: 0 4px 15px rgba(11, 118, 239, 0.25);
                        "
                      >
                        Assinar 6 Meses
                      </a>
                    </td>

                    <!-- Espaço -->
                    <td width="16"></td>

                    <!-- Card 3 -->
                    <td
                      style="
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        padding: 20px;
                        width: 33%;
                        vertical-align: top;
                      "
                    >
                      <h3 style="margin: 0; font-size: 18px; color: #111827">
                        Plano 12 Meses
                      </h3>
                      <p style="margin: 8px 0; font-size: 14px; color: #6b7280">
                        💎 Melhor Custo-Benefício
                      </p>
                      <p
                        style="
                          font-size: 26px;
                          font-weight: bold;
                          color: #0b76ef;
                          margin: 10px 0;
                        "
                      >
                        R$ 49,90<span style="font-size: 14px; font-weight: 400"
                          >/mês</span
                        >
                      </p>
                      <p
                        style="
                          font-size: 13px;
                          color: #6b7280;
                          margin: 0 0 14px 0;
                        "
                      >
                        💰 Total: R$ 598,80<br />
                        + Economia de R$ 600,00
                      </p>
                      <a
                        href="https://wa.me/5583988332659?text=Gerar%20pagamento%20para%20renovação%2012%20meses"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 12px 20px;
                          background: #111827;
                          color: #fff;
                          border-radius: 8px;
                          text-decoration: none;
                          font-weight: 600;
                          box-shadow: 0 4px 15px rgba(17, 24, 39, 0.2);
                        "
                      >
                        Assinar 12 Meses
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top: 18px; font-size: 13px; color: #6b7280">
                  Se preferir, responda este e-mail que envio o link de
                  pagamento direto.
                </p>
              </td>
            </tr>

            <!-- Rodapé -->
            <tr>
              <td
                style="
                  padding: 22px 28px;
                  background: #fafafa;
                  border-top: 1px solid #eef2f7;
                "
              >
                <p style="margin: 0; font-size: 13px; color: #374151">
                  Atenciosamente,<br />
                  <strong>Renato Willon — wDev</strong>
                </p>
              </td>
            </tr>
          </table>

          <!-- Fallback -->
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="680"
            style="max-width: 680px; margin-top: 12px"
          >
            <tr>
              <td style="font-size: 12px; color: #9aa0a6; text-align: center">
                <p style="margin: 0">Caso os botões não funcionem, acesse:</p>
                <p style="margin: 6px 0 0 0">
                  6 meses:
                  https://wa.me/5583988332659?text=Gerar%20pagamento%20para%20renovação%206%20meses<br />
                  12 meses:
                  https://wa.me/5583988332659?text=Gerar%20pagamento%20para%20renovação%2012%20meses
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
 

      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao enviar o email", err },
      { status: 500 },
    );
  }
}
