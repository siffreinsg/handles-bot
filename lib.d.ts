import Application from './src/lib/Gus/Kernel/Application'

declare global {
    
    var app: Application

    namespace NodeJS {
        interface Global {
            app: Application
        }
    }

}
