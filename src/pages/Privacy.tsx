import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b">
        <div className="container flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display font-bold text-lg">Política de Privacidade</h1>
        </div>
      </nav>

      <main className="container max-w-3xl px-4 py-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p className="text-xs">Última atualização: 15 de fevereiro de 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Introdução</h2>
          <p>A {APP_NAME} está comprometida com a proteção dos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Esta política descreve como coletamos, utilizamos e protegemos suas informações.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Dados Coletados</h2>
          <p>Coletamos os seguintes tipos de dados:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Dados de cadastro:</strong> nome, e-mail, foto de perfil e informações públicas.</li>
            <li><strong>Dados de uso:</strong> interações na plataforma, posts, curtidas, comunidades e atividade de afiliado.</li>
            <li><strong>Dados de pagamento:</strong> informações necessárias para processamento de assinaturas e comissões.</li>
            <li><strong>Dados de integrações:</strong> informações obtidas via conexão com redes sociais como TikTok (seguidores, vídeos, métricas).</li>
            <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, dispositivo e cookies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Finalidade do Tratamento</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fornecer e melhorar nossos serviços.</li>
            <li>Processar pagamentos e comissões de afiliados.</li>
            <li>Personalizar sua experiência na plataforma.</li>
            <li>Enviar comunicações relevantes sobre sua conta.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Marcas parceiras, quando você participa de campanhas de afiliado.</li>
            <li>Processadores de pagamento para efetuar transações.</li>
            <li>Autoridades competentes quando exigido por lei.</li>
          </ul>
          <p>Não vendemos seus dados pessoais a terceiros.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Segurança</h2>
          <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia, controle de acesso e políticas de segurança da informação (RLS).</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Seus Direitos (LGPD)</h2>
          <p>Conforme a LGPD, você tem direito a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Acessar seus dados pessoais.</li>
            <li>Corrigir dados incompletos ou desatualizados.</li>
            <li>Solicitar a exclusão dos seus dados.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Cookies</h2>
          <p>Utilizamos cookies para melhorar sua experiência, manter sua sessão ativa e coletar dados analíticos. Você pode gerenciar cookies nas configurações do seu navegador.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Retenção de Dados</h2>
          <p>Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei. Após o encerramento da conta, os dados serão excluídos em até 30 dias, salvo obrigações legais.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Alterações</h2>
          <p>Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas por e-mail ou aviso na plataforma.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Contato do Encarregado (DPO)</h2>
          <p>Para exercer seus direitos ou esclarecer dúvidas, entre em contato: privacidade@onlyshop.com.br</p>
        </section>

        <div className="pt-6 border-t">
          <Link to="/terms" className="text-primary hover:underline text-sm">Ver Termos de Uso →</Link>
        </div>
      </main>
    </div>
  );
}
