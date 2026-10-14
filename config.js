/*
  Dados do escritório em UM só lugar.
  Para trocar telefone, e-mail, endereço ou mensagens do WhatsApp, edite aqui.
  O script.js lê este arquivo e preenche os links e textos do site.
  (Os textos do index.html têm os mesmos dados para funcionar sem JavaScript
   e para os buscadores; se mudar algo aqui, mude lá também.)
*/
window.SITE_CONFIG = {
  name: "Souza Júnior Advocacia",
  lawyer: "Dr. Ronaldo Carlos de Souza Júnior",
  oab: "OAB/SP 469.023",

  whatsapp: {
    number: "5519974188203", // DDI + DDD + número, só dígitos
    display: "+55 19 97418-8203",
  },

  email: "ronaldosouzajr.adv@gmail.com",

  address: {
    line: "Rua Dr. José Pereira Machado, 40B, Centro, Santo Antônio de Posse, SP, CEP 13830-148",
  },

  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Dr.+Jose+Pereira+Machado+40B+Centro+Santo+Antonio+de+Posse+SP",

  instagram: {
    office: "https://www.instagram.com/souzajradvocacia/",
    lawyer: "https://www.instagram.com/ronaldosouzajr.adv/",
  },

  // Mensagens que já vêm escritas na conversa (a pessoa só aperta enviar).
  // A chave é usada no HTML: <a data-wa="criminal">
  messages: {
    geral: "Olá, Dr. Ronaldo. Gostaria de informações sobre atendimento.",
    criminal: "Olá, Dr. Ronaldo. Gostaria de informações sobre atendimento na área criminal.",
    civel: "Olá, Dr. Ronaldo. Gostaria de informações sobre atendimento na área cível.",
    trabalhista: "Olá, Dr. Ronaldo. Gostaria de informações sobre atendimento na área trabalhista.",
  },
};
