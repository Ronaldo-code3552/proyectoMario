from typing import Any, Optional

from app.repositories.proyecto_repository import ProyectoRepository


class ProyectoService:
    @staticmethod
    def get_all(
        page_number: int = 1,
        page_size: int = 20,
        search_term: Optional[str] = None,
    ) -> Any:
        return ProyectoRepository.get_all_json(
            page_number=page_number,
            page_size=page_size,
            search_term=search_term,
        )

    @staticmethod
    def get_by_id(proyecto_id: int) -> Any:
        return ProyectoRepository.get_by_id_json(proyecto_id)
    @staticmethod
    def get_by_id_v2(proyecto_id: int) -> Any:
        return ProyectoRepository.get_by_id_json_v2(proyecto_id)
    
    @staticmethod
    def create(payload: dict) -> Any:
        return ProyectoRepository.insert_json(payload)

    @staticmethod
    def update(proyecto_id: int, payload: dict) -> Any:
        return ProyectoRepository.update_json(proyecto_id, payload)

    @staticmethod
    def delete(proyecto_id: int) -> Any:
        return ProyectoRepository.delete_json(proyecto_id)