import fs from "fs";
import path from "path";
import { DistribuicaoDFe } from "node-mde";

const CERT_PATH = process.env.CERT_PATH;
const CERT_PASS = process.env.CERT_PASS;
const CNPJ = process.env.CNPJ;
const CUF = process.env.CUF; // ex: '35' para SP
const TP_AMB = process.env.TP_AMB || "1"; // '1' = Produção, '2' = Homologação

let client;

async function getClient() {
  if (client) return client;

  const pfx = fs.readFileSync(CERT_PATH);

  client = new DistribuicaoDFe({
    pfx,
    passphrase: CERT_PASS,
    cUFAutor: CUF,
    cnpj: CNPJ,
    tpAmb: TP_AMB,
  });

  if (typeof client.init === "function") {
    await client.init();
  }

  return client;
}

async function listNotas({ start, end }) {
  const cli = await getClient();

  // A lib suporta consulta via “consultaUltNSU” para descobrir novos documentos.
  const resp = await cli.consultaUltNSU("000000000000000");

  if (resp.error) {
    throw new Error(`Distribuição DFe erro: ${resp.error}`);
  }

  return resp.data.docZip.map((doc) => ({
    nsu: doc.nsu,
    chave: doc.json?.nfeProc?.NFe?.infNFe?.$.Id?.substring(3) || null,
    emitente: doc.json?.nfeProc?.NFe?.infNFe?.emit?.xNome || null,
    data: doc.json?.nfeProc?.NFe?.infNFe?.ide?.dhEmi || null,
    valor: doc.json?.nfeProc?.NFe?.infNFe?.total?.ICMSTot?.vNF || null,
    schema: doc.schema,
    xml: doc.xml,
  }));
}

async function downloadXml(chave) {
  const cli = await getClient();
  const resp = await cli.consultaChNFe(chave);

  if (resp.error) {
    throw new Error(`Consulta por chave erro: ${resp.error}`);
  }

  const docs = resp.data.docZip;
  const doc = docs.find((d) => d.schema.startsWith("procNFe"));

  if (!doc) {
    throw new Error(`XML com procNFe não encontrado para chave ${chave}`);
  }

  return Buffer.from(doc.xml, "utf-8");
}

async function manifestar(chave, tipoEvento) {
  const cli = await getClient();

  const lote = {
    chNFe: chave,
    tpEvento: tipoEvento,
    justificativa:
      tipoEvento === "210240"
        ? "Operação não realizada – justificar aqui"
        : undefined,
  };

  const resp = await cli.enviarManifestacao({ lote });

  if (resp.error) {
    throw new Error(`Manifestação erro: ${resp.error}`);
  }

  return resp;
}

export default {
  listNotas,
  downloadXml,
  manifestar,
};
