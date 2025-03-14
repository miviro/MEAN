import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUsuariosComponent } from './usuarios';

describe('ListarUsuariosComponent', () => {
    let component: ListarUsuariosComponent;
    let fixture: ComponentFixture<ListarUsuariosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListarUsuariosComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ListarUsuariosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
