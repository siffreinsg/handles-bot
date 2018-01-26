import Application from 'Handles/Kernel/Application'

try {
    global.app = new Application()
} catch (ex) {
    console.error(ex)
}
