import React from 'react';

export default function InvoiceTable({ invoices, onDownload, onManifest }) {
  return (
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Chave</th>
          <th>Emitente</th>
          <th>Data</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map(inv => (
          <tr key={inv.chave}>
            <td className="mono">{inv.chave}</td>
            <td>{inv.emitente}</td>
            <td>{inv.data}</td>
            <td>{inv.valor}</td>
            <td>
              <button className="btn" onClick={() => onDownload(inv.chave)}>Baixar XML</button>
              <button className="btn outline" onClick={() => onManifest(inv.chave)}>Manifestar Ciência</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
