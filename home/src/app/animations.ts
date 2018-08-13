import { animate, state, style, transition, trigger } from '@angular/animations';

// Component transition animations
export const slidePageAnimation =
    trigger('routeAnimation', [
        state('*',
            style({
                position: 'absolute',
                width: '100%'
            })
        ),
        transition(':enter', [
            style({
                transform: 'translateX(-100%)',
                opacity: 0
            }),
            animate('0.4s ease-in-out', style({
                transform: 'translateX(0%)',
                opacity: 1,
            }))
        ]),
        transition(':leave', [
            style({
                transform: 'translateX(0%)',
                opacity: 1
            }),
            animate('0.4s ease-in-out', style({
                transform: 'translateX(100%)',
                opacity: 0
            }))
        ])
    ]);

export const optionCardAnimation =
    trigger('optionState', [
        state('inactive', style({
            transform: 'scale(1)',
            cursor: 'pointer'
        })),
        state('active', style({
            transform: 'scale(0.95)',
            cursor: 'pointer'
        })),
        transition('inactive => active', animate('100ms ease-in')),
        transition('active => inactive', animate('100ms ease-out'))
    ])