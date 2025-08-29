import React from 'react';
import Section from '../components/layout/Section';
import Grid from '../components/layout/Grid';
import Card from '../components/ui/Card';
import Metric from '../components/ui/Metric';
import Header from '../components/ui/Header';
import Title from '../components/ui/Title';

const DashboardPage: React.FC = () => {
  return (
    <main>
      <Section padding="large" background="light">
        <Header />
        
        <Section padding="medium">
          <Title variant="secondary">Resumo Geral</Title>
          <Grid columns={4} gap="medium">
            <Card variant="info" elevated>
              <Metric 
                label="Total de Usuários"
                value="156"
                variant="info"
                trend="up"
              />
            </Card>
            
            <Card variant="success" elevated>
              <Metric 
                label="Mensageiros Ativos"
                value="12"
                variant="success"
                trend="neutral"
              />
            </Card>
            
            <Card variant="warning" elevated>
              <Metric 
                label="Lançamentos Hoje"
                value="23"
                variant="warning"
                trend="up"
              />
            </Card>
            
            <Card variant="primary" elevated>
              <Metric 
                label="Total Arrecadado"
                value="15.650"
                prefix="R$ "
                variant="primary"
                trend="up"
              />
            </Card>
          </Grid>
        </Section>

        <Section padding="medium">
          <Title variant="secondary">Lançamentos Recentes</Title>
          <Grid columns={2} gap="medium">
            <Card variant="secondary">
              <Title variant="secondary">Entradas</Title>
              <Metric 
                label="Últimas 24h"
                value="2.340"
                prefix="R$ "
                variant="success"
              />
            </Card>
            
            <Card variant="secondary">
              <Title variant="secondary">Saídas</Title>
              <Metric 
                label="Últimas 24h"
                value="1.890"
                prefix="R$ "
                variant="warning"
              />
            </Card>
          </Grid>
        </Section>

        <Section padding="medium">
          <Title variant="secondary">Acertos de Mensageiros</Title>
          <Grid columns={3} gap="medium">
            <Card>
              <Title variant="secondary">Pendentes</Title>
              <Section padding="large">
                <Metric 
                  label="Aguardando processamento"
                  value="—"
                  variant="primary"
                />
              </Section>
            </Card>
            
            <Card>
              <Title variant="secondary">Processados</Title>
              <Section padding="large">
                <Metric 
                  label="Concluídos este mês"
                  value="—"
                  variant="success"
                />
              </Section>
            </Card>
            
            <Card>
              <Title variant="secondary">Em Análise</Title>
              <Section padding="large">
                <Metric 
                  label="Necessitam revisão"
                  value="—"
                  variant="warning"
                />
              </Section>
            </Card>
          </Grid>
        </Section>

        <Section padding="medium">
          <Title variant="secondary">Categorias Mais Usadas</Title>
          <Grid columns={2} gap="medium">
            <Card variant="info">
              <Metric 
                label="Doações"
                value="45"
                suffix="%"
                variant="info"
              />
            </Card>
            
            <Card variant="primary">
              <Metric 
                label="Eventos"
                value="32"
                suffix="%"
                variant="primary"
              />
            </Card>
          </Grid>
        </Section>
      </Section>
    </main>
  );
};

export default DashboardPage;