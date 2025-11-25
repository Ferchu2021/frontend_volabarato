/**
 * Función helper para asignar categorías correctas basándose en el destino
 * @param destino - Nombre del destino del paquete
 * @param categoria - Categoría existente del paquete (opcional)
 * @returns Categoría correcta asignada
 */
export const getCategoryFromDestination = (destino: string, categoria?: string): string => {
  // Validar que destino no sea null o undefined
  if (!destino || typeof destino !== 'string') {
    return 'Cultural' // Default en lugar de "Otros"
  }

  // Si ya tiene una categoría válida, convertir "Playa" a "Caribe" y eliminar "Otros"
  if (categoria && categoria.trim() !== '' && categoria !== 'General') {
    // Convertir "Playa" a "Caribe"
    if (categoria.toLowerCase() === 'playa' || categoria.toLowerCase() === 'playas') {
      return 'Caribe'
    }
    // Convertir "Otros" a una categoría detectada
    if (categoria.toLowerCase() === 'otros' || categoria.toLowerCase() === 'otro') {
      // Continuar con la detección automática
    } else {
      return categoria
    }
  }

  const destinoLower = destino.toLowerCase()

  // Destinos del Caribe (antes "Playa")
  // Incluye: Cancún, Punta Cana, Playa del Carmen, Aruba, Bayahibe, etc.
  const caribeDestinos = [
    'cancún', 'cancun', 'punta cana', 'aruba', 'bayahibe', 'playa del carmen',
    'caribe', 'república dominicana', 'republica dominicana', 'bahía', 'bahia'
  ]
  if (caribeDestinos.some(d => destinoLower.includes(d))) {
    return 'Caribe'
  }

  // Destinos de Argentina (incluye Cataratas del Iguazú)
  const argentinaDestinos = [
    'bariloche', 'mendoza', 'cataratas', 'iguazú', 'iguazu', 'argentina',
    'buenos aires', 'salta', 'jujuy', 'córdoba', 'cordoba', 'mar del plata',
    'villa la angostura', 'san martín', 'san martin', 'el calafate',
    'ushuaia', 'tierra del fuego', 'patagonia'
  ]
  if (argentinaDestinos.some(d => destinoLower.includes(d))) {
    return 'Argentina'
  }

  // Destinos de Estados Unidos (incluye Orlando + Miami)
  const estadosUnidosDestinos = [
    'miami', 'orlando', 'florida', 'estados unidos', 'usa', 'new york',
    'nueva york', 'los angeles', 'las vegas', 'california'
  ]
  if (estadosUnidosDestinos.some(d => destinoLower.includes(d))) {
    return 'Estados Unidos'
  }

  // Destinos de Brasil
  const brasilDestinos = [
    'brasil', 'brazil', 'são paulo', 'sao paulo', 'rio de janeiro',
    'buzios', 'florianopolis', 'natal', 'pipa', 'porto de galhinas', 'porto de galinhas',
    'recife', 'salvador', 'bahía', 'bahia'
  ]
  if (brasilDestinos.some(d => destinoLower.includes(d))) {
    return 'Brasil'
  }

  // Destinos de México (excluyendo Cancún y Playa del Carmen que van a Caribe)
  const mexicoDestinos = [
    'méxico', 'mexico', 'riviera maya', 'tulum', 'cozumel', 'ciudad de méxico',
    'ciudad de mexico', 'guadalajara', 'mérida', 'merida'
  ]
  if (mexicoDestinos.some(d => destinoLower.includes(d))) {
    return 'México'
  }

  // Destinos de Europa
  const europaDestinos = [
    'españa', 'spain', 'italia', 'italy', 'francia', 'france', 'portugal',
    'grecia', 'greece', 'venecia', 'venice', 'puglia', 'balcanes', 'balkans',
    'alemania', 'germany', 'inglaterra', 'england', 'reino unido', 'uk'
  ]
  if (europaDestinos.some(d => destinoLower.includes(d))) {
    return 'Europa'
  }

  // Destinos de Asia
  const asiaDestinos = [
    'china', 'japón', 'japon', 'japan', 'tailandia', 'thailand',
    'singapur', 'singapore', 'india', 'corea', 'korea'
  ]
  if (asiaDestinos.some(d => destinoLower.includes(d))) {
    return 'Asia'
  }

  // Destinos de Aventura
  const aventuraDestinos = [
    'aventura', 'trekking', 'montaña', 'montana', 'escalada', 'rafting',
    'safari', 'kenia', 'kenya', 'canadá', 'canada', 'alaska'
  ]
  if (aventuraDestinos.some(d => destinoLower.includes(d))) {
    return 'Aventura'
  }

  // Si no coincide con ninguna categoría, usar 'Cultural' como default
  return 'Cultural'
}

