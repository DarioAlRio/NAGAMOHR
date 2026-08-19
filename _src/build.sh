#!/usr/bin/env bash
# Ensambla las páginas estáticas a partir de las parciales de _src/.
# Uso:  bash _src/build.sh   (desde la raíz del proyecto)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/_src"

build () {
  local out="$1" body="$2" section="$3" mode="$4" slug="$5" title="$6" desc="$7"
  {
    sed -e "s|{{TITLE}}|$title|g" \
        -e "s|{{DESC}}|$desc|g" \
        -e "s|{{SLUG}}|$slug|g" \
        -e "s|{{SECTION}}|$section|g" \
        -e "s|{{MODE}}|$mode|g" "$SRC/head.html"
    cat "$SRC/$body"
    cat "$SRC/foot.html"
  } > "$ROOT/$out"
  printf '  %-28s %s\n' "$out" "$(wc -c < "$ROOT/$out") bytes"
}

echo "Construyendo nagamohr…"

build index.html               body-index.html         home          over  es \
  "Nagamohr S.A. · Decoletaje de precisión para automoción" \
  "Decoletador de precisión en Getafe (Madrid). Ejes de transmisión, cajas de distribución y válvulas para la industria del automóvil. 40 millones de ejes al año."

build empresa.html             body-empresa.html       empresa       solid es/empresa \
  "Empresa · Nagamohr S.A." \
  "Nagamohr nació en 1993 del traslado de un centro de producción alemán a España. Más de 150 empleados y 40 millones de ejes al año."

build productos.html           body-productos.html     productos     solid es/productos \
  "Productos · Nagamohr S.A." \
  "Ejes de transmisión macizos y huecos, ejes para cajas de distribución, acero inoxidable para recirculación de gases y otros ejes y válvulas."

build posibilidades.html       body-posibilidades.html posibilidades solid es/productos/posibilidades-de-produccion \
  "Posibilidades de producción · Nagamohr S.A." \
  "Diámetros de 6 a 38 mm y longitudes hasta 250 mm. Catorce procesos de mecanizado y ocho tratamientos superficiales."

build medios-productivos.html  body-medios.html        medios        solid es/maquinaria/medios-productivos \
  "Medios productivos · Nagamohr S.A." \
  "Más de 100 máquinas: transfer rotativas Hydromat, tornos multihusillo y CNC, rectificadoras, laminadoras y taladro profundo."

build galeria.html             body-galeria.html       galeria       solid es/maquinaria/galeria-de-fotos \
  "Galería de fotos · Nagamohr S.A." \
  "Imágenes de la planta de producción de Nagamohr en Getafe (Madrid): torneado, segundas operaciones y control de proceso."

build certificados.html        body-certificados.html  certificados  solid es/calidad/certificados-de-calidad \
  "Certificados de calidad · Nagamohr S.A." \
  "IATF 16949, ISO 9001 e ISO 14001. Un 15 % de los recursos de Nagamohr se dedica a mantener y mejorar la calidad."

build metrologia.html          body-metrologia.html    metrologia    solid es/calidad/equipos-de-metrologia \
  "Equipos de metrología · Nagamohr S.A." \
  "Laboratorio propio con equipos Zeiss, Mitutoyo, Marposs, Tesa y Jenoptic. Ensayos metalográficos y verificación 100 %."

build noticias.html            body-noticias.html      noticias      solid es/noticias \
  "Noticias · Nagamohr S.A." \
  "Actualidad de Nagamohr: Metalmadrid, la integración de Nagamohr Barcelona y el contrato PPA de energía 100 % solar."

build contacto.html            body-contacto.html      contacto      solid es/contacto \
  "Contacto · Nagamohr S.A." \
  "Calle Diseño 9, Pol. Ind. Los Olivos, 28906 Getafe (Madrid). Tel. +34 91 601 02 74 · info@nagamohr.com"

echo "Listo."
