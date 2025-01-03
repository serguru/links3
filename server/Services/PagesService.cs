﻿using AutoMapper;
using server.Data;
using server.Data.Entities;
using server.Data.Models;

namespace server.Services;

public class PagesService(
    IPagesRepository pagesRepository,
    IRowsRepository rowsRepository,
    IMapper mapper) : IPagesService
{
    private readonly IPagesRepository _pagesRepository = pagesRepository;
    private readonly IRowsRepository _rowsRepository = rowsRepository;
    private readonly IMapper _mapper = mapper;

    #region Pages
    public async Task<List<PageModel>> GetAllPagesAsync()
    {
        List<Page> entities = await _pagesRepository.GetAllPagesAsync();
        List<PageModel> models = _mapper.Map<List<PageModel>>(entities);
        return models;
    }

    public async Task<PageModel> AddPageAsync(PageModel page)
    {
        Page entity = _mapper.Map<Page>(page);
        await _pagesRepository.AddPageAsync(entity);
        PageModel result = _mapper.Map<PageModel>(entity);    
        return result;
    }

    public async Task DeletePageAsync(int pageId)
    {
        await _pagesRepository.DeletePageAsync(pageId);
    }

    public async Task<PageModel?> GetPageByIdAsync(int pageId)
    {
        Page? entity = await pagesRepository.GetPageByIdAsync(pageId);
        if (entity == null) 
        { 
            return null;
        }
        PageModel model = _mapper.Map<PageModel>(entity);
        return model;
    }

    public async Task<PageModel> UpdatePageAsync(PageModel page)
    {
        Page entity = _mapper.Map<Page>(page);
        await _pagesRepository.UpdatePageAsync(entity);
        PageModel model = _mapper.Map<PageModel>(entity);
        return model;
    }

    public async Task<PageModel> AddOrUpdatePageAsync(PageModel page)
    {
        Page entity = _mapper.Map<Page>(page);
        if (entity.Id == 0)
        {
            await _pagesRepository.AddPageAsync(entity);
        }
        else
        {
            await _pagesRepository.UpdatePageAsync(entity);
        }
        PageModel model = _mapper.Map<PageModel>(entity);
        return model;
    }
    #endregion

    #region Rows
    public async Task<List<LrowModel>> GetAllRowsAsync(int pageId)
    {
        List<Lrow> entities = await _rowsRepository.GetAllRowsAsync(pageId);
        List<LrowModel> models = _mapper.Map<List<LrowModel>>(entities);
        return models;
    }

    public async Task<LrowModel?> GetRowByIdAsync(int rowId)
    {
        Lrow? entity = await _rowsRepository.GetRowByIdAsync(rowId);
        if (entity == null)
        {
            return null;
        }
        LrowModel model = _mapper.Map<LrowModel>(entity);
        return model;
    }

    public async Task<LrowModel> AddRowAsync(LrowModel row)
    {
        Lrow entity = _mapper.Map<Lrow>(row);
        await _rowsRepository.AddRowAsync(entity);
        LrowModel result = _mapper.Map<LrowModel>(entity);
        return result;
    }

    public async Task<LrowModel> UpdateRowAsync(LrowModel row)
    {
        Lrow entity = _mapper.Map<Lrow>(row);
        await _rowsRepository.UpdateRowAsync(entity);
        LrowModel model = _mapper.Map<LrowModel>(entity);
        return model;
    }

    public async Task<LrowModel> AddOrUpdateRowAsync(LrowModel row)
    {
        Lrow entity = _mapper.Map<Lrow>(row);
        if (entity.Id == 0)
        {
            await _rowsRepository.AddRowAsync(entity);
        }
        else
        {
            await _rowsRepository.UpdateRowAsync(entity);
        }
        LrowModel model = _mapper.Map<LrowModel>(entity);
        return model;
    }

    public async Task DeleteRowAsync(int rowId)
    {
        await _rowsRepository.DeleteRowAsync(rowId);
    }

    #endregion
}


