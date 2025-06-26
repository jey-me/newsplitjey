# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


1. 🌱 Grupo y Eventos
 ¿Puedo crear un grupo?

 ¿Puedo crear varios eventos dentro de un grupo?

 ¿El evento se asocia al grupo correcto?

 ¿El slug del evento permite acceder a ese evento tras crearlo?

 ¿Al cambiar el nombre del evento, el slug queda igual (para que no se rompan links)?
(Esto es importante si no has implementado un update automático de slug)

2. 👥 Gestión de Miembros
 ¿Puedo añadir miembros al grupo?

 ¿Me bloquea si intento meter 2 miembros con el mismo nombre en el mismo grupo?

 ¿Puedo tener miembros con el mismo nombre en diferentes grupos?

 ¿Al crear un nuevo evento dentro del grupo, los miembros del grupo se heredan bien al evento?
(o ¿sigues un flow donde se añaden luego a nivel de evento?)

3. 🏷️ Participantes por Evento
 ¿Puedo añadir o eliminar participantes solo para ese evento (sin afectar el grupo)?

 ¿Los event_members son consistentes en Supabase tras cada cambio?

 ¿Al ver un expense o item, solo veo a los miembros de ese evento como posibles pagadores/asignados?

4. 💸 Expenses
 ¿Puedo crear un gasto?

 ¿Puedo especificar quién paga?

 ¿Puedo decidir entre "split entre todos" o customizar quién participa?

 ¿El gasto queda vinculado al event_id correcto?

 ¿Se guarda correctamente en Supabase?

 ¿Al abrir HomePage veo ese gasto listado?

5. 🛒 Shopping Items
 ¿Puedo añadir un item con cantidad y tags?

 ¿Puedo asignarlo a alguien?

 ¿Puedo editarlo?

 ¿Puedo marcarlo como comprado (✔️ + strikethrough + opacity)?

 ¿Se mantiene el filtro por evento?

6. 🧹 UI/UX Behavior (Mobile First)
 ¿El NavMenu funciona en todas las pantallas?

 ¿El ActionSelector ("+") abre y cierra como debe?

 ¿El ExtendedMenu (3 dots) abre y cierra al hacer click fuera?

 ¿Todas las popups (Add Member, Add Expense, Add Item) cierran al hacer click fuera y piden confirmación si hay cambios no guardados?

 ¿En móviles pequeños (tipo iPhone SE), todo el contenido cabe sin overflow?

7. 🔗 Navegación y URLs
 ¿Si copio la URL de un evento y la abro en otra pestaña, carga bien todo?

 ¿Si cambio el nombre de un evento, puedo seguir accediendo por el slug viejo?
(O define qué comportamiento quieres aquí: slug fijo vs slug dinámico)

8. 🔄 Datos en Supabase
 ¿Expenses, Items, Event Members, Members y Events se están guardando donde toca?

 ¿No se generan duplicados inesperados en Members o Event Members?

 ¿Al recargar, la app vuelve a montar correctamente el estado desde Supabase?

9. 🚨 Error Handling
 ¿Qué pasa si intento crear un gasto sin seleccionar pagador?

 ¿Qué pasa si intento añadir un miembro con nombre vacío?

 ¿Qué pasa si borro un miembro y ese miembro tenía expenses asignados?
(¿Lo bloqueas? ¿Lo permites? ¿Lo dejas pendiente para siguiente sprint?)

10. BONUS (solo si quieres ir pro)
 ¿Tienes logs en consola para trackear las operaciones clave (creación de grupo, evento, miembro, expense)?

 ¿Te salen errores de Supabase claros y entendibles si falla una operación?