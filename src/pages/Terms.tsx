import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b">
        <div className="container flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display font-bold text-lg">Termos de Uso</h1>
        </div>
      </nav>

      <main className="container max-w-3xl px-4 py-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p className="text-xs">Última atualização: 15 de fevereiro de 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar a plataforma {APP_NAME}, você concorda integralmente com estes Termos de Uso. Caso não concorde, interrompa o uso imediatamente.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Descrição do Serviço</h2>
          <p>A {APP_NAME} é uma plataforma de social commerce que combina rede social, sistema de afiliados e monetização de conteúdo. Oferecemos funcionalidades como perfil público, feed, comunidades, ranking, links de afiliado e integração com redes sociais externas.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Cadastro e Conta</h2>
          <p>Para utilizar os serviços, você deve criar uma conta com informações verdadeiras. Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Planos e Pagamentos</h2>
          <p>A plataforma oferece planos gratuitos e pagos. Ao contratar um plano pago, você concorda com os valores e condições apresentados no momento da contratação. Cancelamentos podem ser realizados a qualquer momento, sendo efetivos ao final do período vigente.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Programa de Afiliados</h2>
          <p>Ao participar do programa de afiliados, você concorda em promover produtos de forma ética e transparente. Comissões são calculadas conforme as regras de cada campanha e pagas após confirmação da venda. Práticas fraudulentas resultarão em cancelamento imediato da conta.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Conteúdo do Usuário</h2>
          <p>Você mantém a propriedade do conteúdo publicado, mas concede à {APP_NAME} uma licença não exclusiva para exibição na plataforma. É proibido publicar conteúdo ilegal, ofensivo, difamatório ou que viole direitos de terceiros.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Responsabilidades</h2>
          <p>A {APP_NAME} não se responsabiliza por perdas financeiras decorrentes do uso da plataforma, indisponibilidades temporárias ou ações de terceiros. Os produtos promovidos são de responsabilidade das marcas cadastradas.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Rescisão</h2>
          <p>Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, sem aviso prévio. Você pode excluir sua conta a qualquer momento através das configurações do perfil.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Legislação Aplicável</h2>
          <p>Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Contato</h2>
          <p>Para dúvidas sobre estes termos, entre em contato pelo e-mail: contato@onlyshop.com.br</p>
        </section>

        <div className="pt-6 border-t">
          <Link to="/privacy" className="text-primary hover:underline text-sm">Ver Política de Privacidade →</Link>
        </div>
      </main>
    </div>
  );
}
