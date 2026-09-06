import { executeMutation, getDataConnect, mutationRef } from "firebase/data-connect";
import { app, dataConnect } from "@/lib/firebase/client";
import { connectorConfig, getMiComandaGuardada } from "@/src/dataconnect-generated";

export interface CrearComandaConFlujoVariables {
  id: string;
  numeroComanda: string;
  clienteId: string;
  empresa?: string;
  proyecto?: string;
  observaciones?: string;
  detalles: {
    tipoPrendaId: string;
    tipoServicioId: string;
    cantidad: number;
    detalle?: string;
    precioUnitario: number;
    subtotal: number;
  }[];
}

type Resultado = { comanda_insert: { id: string } };

// El generador aún no admite inputs _Data con @allow. Mantener este contrato
// acotado al input de dataconnect/produccion/mutations.gql.
export async function guardarComandaConFlujo(variables: CrearComandaConFlujoVariables) {
  const dc = getDataConnect(app, { ...connectorConfig, connector: "produccion" });
  try {
    const result = await executeMutation(mutationRef<Resultado, CrearComandaConFlujoVariables>(
      dc, "CrearComandaConFlujo", variables,
    ));
    return result.data.comanda_insert.id;
  } catch (error) {
    // Una respuesta perdida no debe provocar otro INSERT ni duplicar el flujo.
    // El UUID se conserva en el formulario hasta confirmar el guardado.
    try {
      const result = await getMiComandaGuardada(dataConnect, { id: variables.id }, { fetchPolicy: "SERVER_ONLY" });
      if (result.data.comanda) return result.data.comanda.id;
    } catch {
      // Si tampoco puede verificarse, conservar el error y el UUID para reintentar.
    }
    throw error;
  }
}
