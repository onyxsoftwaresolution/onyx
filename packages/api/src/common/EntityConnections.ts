export type Entity = { [id: string]: number };

export type EntityConnections = {
  connect: Entity[];
  disconnect: Entity[];
}

export function getEntityConnections<T extends Entity>(present: T[], future: T[]): EntityConnections {
  const presentIds = present.map(p => p.id);
  const futureIds = future.map(p => p.id);
  const connect = future.filter(p => !presentIds.includes(p.id)).map(c => ({ id: c.id }));
  const disconnect = present.filter(p => !futureIds.includes(p.id)).map(d => ({ id: d.id }));

  return ({
    connect,
    disconnect,
  });
}
