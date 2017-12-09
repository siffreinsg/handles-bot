import Application from './src/lib/Application'

declare global {
    
    var app: Application

    namespace NodeJS {
        interface Global {
            app: Application
        }
    }

}
