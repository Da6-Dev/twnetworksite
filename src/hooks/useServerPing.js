import { useState, useEffect, useCallback } from 'react';
import { serverInfo } from '../data/serverData';

export function useServerPing(ipServidor = serverInfo.ip) {
  const [dadosServidor, setDadosServidor] = useState({
    online: true,
    totalOnline: serverInfo.totalOnline,
    capacidadeMaxima: serverInfo.capacidadeMaxima,
    versao: serverInfo.versao,
    motd: 'TW Network • O melhor servidor de RankUP!',
    carregando: false,
    ultimaAtualizacao: null,
  });

  const consultarStatus = useCallback(async () => {
    setDadosServidor((prev) => ({ ...prev, carregando: true }));

    try {
      // Consulta a API pública de ping do Minecraft
      const resposta = await fetch(`https://api.mcsrvstat.us/3/${ipServidor}`);
      const dados = await resposta.json();

      if (dados && dados.online) {
        setDadosServidor({
          online: true,
          totalOnline: dados.players?.online ?? serverInfo.totalOnline,
          capacidadeMaxima: dados.players?.max ?? serverInfo.capacidadeMaxima,
          versao: dados.version ?? serverInfo.versao,
          motd: dados.motd?.clean ? dados.motd.clean.join(' ') : 'TW Network Online',
          carregando: false,
          ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      } else {
        // Fallback suave para dados de prévia caso o servidor esteja em configuração de DNS
        setDadosServidor({
          online: true,
          totalOnline: serverInfo.totalOnline,
          capacidadeMaxima: serverInfo.capacidadeMaxima,
          versao: serverInfo.versao,
          motd: 'Modo de Prévia • Em Breve Oficialmente Online',
          carregando: false,
          ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      }
    } catch {
      // Em caso de erro de rede, mantém o layout seguro
      setDadosServidor({
        online: true,
        totalOnline: serverInfo.totalOnline,
        capacidadeMaxima: serverInfo.capacidadeMaxima,
        versao: serverInfo.versao,
        motd: 'Rede em Manutenção Programada',
        carregando: false,
        ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }
  }, [ipServidor]);

  useEffect(() => {
    let ativo = true;

    const carregarInicial = async () => {
      try {
        const resposta = await fetch(`https://api.mcsrvstat.us/3/${ipServidor}`);
        const dados = await resposta.json();

        if (!ativo) return;

        if (dados && dados.online) {
          setDadosServidor({
            online: true,
            totalOnline: dados.players?.online ?? serverInfo.totalOnline,
            capacidadeMaxima: dados.players?.max ?? serverInfo.capacidadeMaxima,
            versao: dados.version ?? serverInfo.versao,
            motd: dados.motd?.clean ? dados.motd.clean.join(' ') : 'TW Network Online',
            carregando: false,
            ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          });
        } else {
          setDadosServidor({
            online: true,
            totalOnline: serverInfo.totalOnline,
            capacidadeMaxima: serverInfo.capacidadeMaxima,
            versao: serverInfo.versao,
            motd: 'Modo de Prévia • Em Breve Oficialmente Online',
            carregando: false,
            ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          });
        }
      } catch {
        if (!ativo) return;
        setDadosServidor({
          online: true,
          totalOnline: serverInfo.totalOnline,
          capacidadeMaxima: serverInfo.capacidadeMaxima,
          versao: serverInfo.versao,
          motd: 'Rede em Manutenção Programada',
          carregando: false,
          ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      }
    };

    carregarInicial();
    const intervalo = setInterval(carregarInicial, 60000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [ipServidor]);

  return { ...dadosServidor, atualizar: consultarStatus };
}