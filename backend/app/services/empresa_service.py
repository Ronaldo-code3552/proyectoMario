from typing import Any, Optional
from app.repositories.empresa_repository import EmpresaRepository


class EmpresaService:
    @staticmethod
    def get_all(
        page_number: int = 1,
        page_size: int = 20,
        search_term: Optional[str] = None,
    ) -> Any:
        return EmpresaRepository.get_all_json(
            page_number=page_number,
            page_size=page_size,
            search_term=search_term,
        )

    @staticmethod
    def get_by_id(empresa_id: int) -> Any:
        return EmpresaRepository.get_by_id_json(empresa_id)

    @staticmethod
    def create(payload: dict) -> Any:
        return EmpresaRepository.insert_json(payload)

    @staticmethod
    def update(empresa_id: int, payload: dict) -> Any:
        return EmpresaRepository.update_json(empresa_id, payload)

    @staticmethod
    def delete(empresa_id: int, force: bool = False) -> Any:
        return EmpresaRepository.delete_json(empresa_id, force)