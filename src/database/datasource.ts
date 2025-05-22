import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5055,
    username: 'postgres',
    password: '1234',
    database: 'aldairTesis',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // No activar sincronización automática en producción
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'], // Directorio de migraciones
});
