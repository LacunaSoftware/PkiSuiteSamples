<?php

// TODO: Write description.
class PadesVisualElementsExpress {

    // TODO: Write description.
    public function getVisualRepresentation($sampleNumber)
    {

        switch ($sampleNumber) {
            case 1:
                // Example #1: visual representation equivalent to content/vr.json
                return array(
                    'text' => array(
                        'fontSize' => 13.0,
                        'text' => "Signed by {{name}} ({{br_cpf_formatted}})",
                        'includeSigningTime' => true,
                        'horizontalAlign' => null,
                        'container' => array(
                            'left' => 0.2,
                            'top' => 0.2,
                            'right' => 0.2,
                            'bottom' => 0.2,
                            'width' => null,
                            'height' => null
                        )
                    ),
                    'image' => array(
                        'resource' => array(
                            'url' => 'fref://stamp',
                            'content' => null,
                            'mimeType' => null
                        ),
                        'opacity' => null,
                        'horizontalAlign' => null,
                        'verticalAlign' => null,
                    ),
                    'position' => array(
                        'pageNumber' => -1,
                        'measurementUnits' => null,
                        'pageOptimization' => null,
                        'auto' => array(
                            'container' => array(
                                'left' => 1.5,
                                'top' => null,
                                'right' => 1.5,
                                'bottom' => 1.5,
                                'width' => null,
                                'height' => 4.94
                            ),
                            'signatureRectangleSize' => array(
                                'height' => 4.94,
                                'width' => 8.0
                            ),
                            'rowSpacing' => 0.0
                        ),
                        'manual' => null

                    )
                );

            default:
                return null;
        }
    }
}
